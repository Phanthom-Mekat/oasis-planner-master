from typing import Annotated, TypedDict, Optional, Dict, Any, List
from datetime import datetime
import uuid
import time
import json

from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

from app.core.config import settings
from app.tools.urban_planning_tools import (
    get_city_satellite_imagery, get_natural_disasters, analyze_air_quality_trends,
    assess_urban_heat_islands, monitor_urban_sprawl, analyze_flood_risk_zones,
    assess_green_space_distribution, analyze_nighttime_lights
)


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], lambda x, y: x + y]
    session_id: str


class UrbanPlannerAgentService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-flash-latest",
            google_api_key=settings.google_api_key,
            temperature=0.7
        )
        
        self.tools = [
            get_city_satellite_imagery,
            get_natural_disasters,
            analyze_air_quality_trends,
            assess_urban_heat_islands,
            monitor_urban_sprawl,
            analyze_flood_risk_zones,
            assess_green_space_distribution,
            analyze_nighttime_lights
        ]
        
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        self.agent_graph = self._create_agent_graph()
        self.sessions = {}
    
    def _get_session_history(self, session_id: str, limit: int = 10) -> List[BaseMessage]:
        """Retrieve conversation history from memory"""
        return self.sessions.get(session_id, [])[-limit:]
    
    def _save_to_session(self, session_id: str, message: BaseMessage):
        """Save message to session history"""
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append(message)
    
    def _create_agent_graph(self):
        """Create the agent graph with state management"""
        
        def agent_node(state: AgentState):
            system_prompt = """You are an AI Urban Planning Assistant, an expert advisor powered by NASA's Earth observation data and satellite imagery.

Your mission is to help urban planners make data-driven decisions for sustainable, resilient, and equitable cities.

CONTEXT:
You're assisting with urban planning challenges in cities like Dhaka, Bangladesh and similar rapidly urbanizing areas. Focus on practical, actionable insights using satellite and geospatial data.

CAPABILITIES & TOOLS:
🛰️ Satellite Imagery - Monitor urban growth, land use, construction (get_city_satellite_imagery)
🌪️ Disaster Tracking - Track floods, wildfires, storms for risk assessment (get_natural_disasters)
💨 Air Quality - Analyze pollution trends for health and zoning policies (analyze_air_quality_trends)
🔥 Heat Islands - Identify hot zones and cooling strategies (assess_urban_heat_islands)
🏘️ Urban Sprawl - Monitor city expansion and growth patterns (monitor_urban_sprawl)
💧 Flood Risk - Assess flood-prone areas for drainage planning (analyze_flood_risk_zones)
🌳 Green Space - Evaluate parks and vegetation equity (assess_green_space_distribution)
💡 Nighttime Lights - Analyze economic activity and infrastructure gaps (analyze_nighttime_lights)

VISUALIZATION CAPABILITIES:
📊 Interactive Maps - The frontend can display data using deck.gl visualization layers:
  - Heatmaps: For heat islands, pollution density, disaster hotspots
  - Scatterplots: For monitoring stations, points of interest, categorized data
  - Line Layers: For connections, flow patterns, transportation networks
  - 3D Views: For buildings, elevation data, vertical analysis

When providing geospatial data, structure it with coordinates for optimal visualization.

INTERACTION STYLE:
- Provide actionable planning recommendations
- Connect data insights to real-world interventions
- Consider equity and sustainability in all advice
- Reference specific neighborhoods or districts when possible
- Suggest policy implications and next steps
- Be practical and solution-oriented
- For general questions, provide informative conversational responses
- For data requests, use tools to fetch real NASA data

TOOL USAGE STRATEGY:
1. Always ask for city location (lat/lon) if not provided
2. For Dhaka, use: lat=23.8103, lon=90.4125
3. For disaster tracking in Bangladesh region: bbox='88,20,93,27'
4. Use multiple tools together for comprehensive analysis
5. Provide visualization data (coordinates, bounds) for mapping

URBAN PLANNING FOCUS AREAS:
- **Climate Resilience**: Flood risk, heat islands, green infrastructure
- **Equity**: Fair distribution of services, green space, infrastructure
- **Sustainability**: Land use, transportation, energy efficiency
- **Public Health**: Air quality, parks access, disaster preparedness
- **Economic Development**: Infrastructure planning, growth management

When presenting data:
- Start with key findings and implications
- Provide specific recommendations with priorities
- Include coordinates and bounds for map visualization
- Reference planning standards and best practices
- Suggest monitoring metrics and KPIs
- Consider implementation feasibility

EXAMPLE RESPONSE FORMAT:
1. Key Finding: [What the data shows]
2. Planning Implications: [Why it matters]
3. Recommendations: [Specific actions, prioritized]
4. Visualization Data: [Coordinates, bounds for mapping]
5. Next Steps: [Follow-up analysis needed]

Always ground your advice in data, consider local context, and prioritize equity and sustainability!"""
            
            session_id = state.get("session_id")
            history_messages = []
            if session_id:
                history_messages = self._get_session_history(session_id, limit=8)
            
            all_messages = [SystemMessage(content=system_prompt)]
            if history_messages:
                all_messages.extend(history_messages)
            all_messages.extend(state["messages"])
            
            response = self.llm_with_tools.invoke(all_messages)
            
            if session_id:
                self._save_to_session(session_id, state["messages"][-1])
                self._save_to_session(session_id, response)
            
            return {"messages": [response]}
        
        graph = StateGraph(AgentState)
        graph.add_node("agent", agent_node)
        graph.add_node("tools", ToolNode(self.tools))
        graph.set_entry_point("agent")
        
        graph.add_conditional_edges(
            "agent",
            lambda x: "tools" if x["messages"][-1].tool_calls else END,
        )
        graph.add_edge("tools", "agent")
        
        return graph.compile()
    
    async def process_message(
        self,
        message: str,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process user message and return response"""
        start_time = time.time()
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Detect if this is a visualization request that should use Gemini for general conversation
        visualization_keywords = [
            'show', 'display', 'visualize', 'map', 'chart', 'graph', 
            'heatmap', 'scatterplot', 'line', '3d', 'layer'
        ]
        
        # Check if this is a general conversation (use Gemini)
        # vs a data request (use tools)
        is_general_chat = not any(keyword in message.lower() for keyword in [
            'disaster', 'flood', 'air quality', 'heat island', 'satellite',
            'urban sprawl', 'green space', 'nighttime light'
        ])
        
        state = {
            "messages": [HumanMessage(content=message)],
            "session_id": session_id
        }
        
        try:
            result = self.agent_graph.invoke(state)
            
            response_message = result["messages"][-1]
            response_content = response_message.content
            
            tool_calls = []
            tool_outputs = {}
            
            for msg in result["messages"]:
                if hasattr(msg, 'tool_calls') and msg.tool_calls:
                    for tool_call in msg.tool_calls:
                        tool_calls.append({
                            "name": tool_call.get("name", ""),
                            "args": tool_call.get("args", {}),
                            "id": tool_call.get("id", "")
                        })
                
                if hasattr(msg, 'content') and isinstance(msg.content, str):
                    try:
                        if msg.content.startswith('{') or msg.content.startswith('['):
                            tool_data = json.loads(msg.content.replace("'", '"'))
                            if tool_calls:
                                tool_name = tool_calls[-1].get("name", "")
                                if tool_name:
                                    tool_outputs[tool_name] = tool_data
                    except (json.JSONDecodeError, ValueError):
                        pass
            
            processing_time = time.time() - start_time
            
            response = {
                "content": response_content,
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "tool_calls": tool_calls,
                "tool_outputs": tool_outputs,
                "processing_time": processing_time,
                "success": True
            }
            
            return response
            
        except Exception as e:
            processing_time = time.time() - start_time
            
            return {
                "content": f"Sorry, an error occurred: {str(e)}. Please try again.",
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "processing_time": processing_time,
                "error": str(e),
                "success": False
            }


urban_planner_agent = UrbanPlannerAgentService()


async def process_planning_query(
    query: str,
    session_id: Optional[str] = None
) -> Dict[str, Any]:
    """Process urban planning query"""
    return await urban_planner_agent.process_message(
        message=query,
        session_id=session_id
    )


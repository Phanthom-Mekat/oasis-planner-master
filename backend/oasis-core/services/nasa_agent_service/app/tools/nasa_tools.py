import requests
from datetime import datetime, timedelta
from typing import Optional, List
from langchain.tools import tool
from app.core.config import settings

@tool
def get_apod(date: Optional[str] = None, hd: bool = False) -> str:
    """
    Get NASA's Astronomy Picture of the Day (APOD).
    
    Args:
        date: Date in YYYY-MM-DD format. If not provided, returns today's APOD.
        hd: Whether to retrieve the HD image URL.
    
    Returns:
        JSON string with APOD data including title, explanation, url, and hdurl.
    """
    try:
        url = f"{settings.nasa_base_url}/planetary/apod"
        params = {"api_key": settings.nasa_api_key}
        
        if date:
            params["date"] = date
        if hd:
            params["hd"] = "True"
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        return str(data)
    except Exception as e:
        return f"Error fetching APOD: {str(e)}"

@tool
def get_mars_rover_photos(
    rover: str = "curiosity",
    sol: Optional[int] = None,
    earth_date: Optional[str] = None,
    camera: Optional[str] = None
) -> str:
    """
    Get photos from Mars rovers (Curiosity, Opportunity, Spirit).
    
    Args:
        rover: Rover name (curiosity, opportunity, spirit).
        sol: Martian sol (day). If not provided, uses earth_date.
        earth_date: Earth date in YYYY-MM-DD format.
        camera: Camera abbreviation (FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM, PANCAM, MINITES).
    
    Returns:
        JSON string with photo data.
    """
    try:
        url = f"{settings.nasa_base_url}/mars-photos/api/v1/rovers/{rover}/photos"
        params = {"api_key": settings.nasa_api_key}
        
        if sol is not None:
            params["sol"] = sol
        elif earth_date:
            params["earth_date"] = earth_date
        else:
            params["sol"] = 1000
        
        if camera:
            params["camera"] = camera
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        photos = data.get("photos", [])[:5]
        
        if not photos:
            return f"No photos found for {rover} on sol={sol} earth_date={earth_date}"
        
        result = {
            "rover": rover,
            "total_photos": len(photos),
            "photos": [
                {
                    "id": photo.get("id"),
                    "sol": photo.get("sol"),
                    "camera": photo.get("camera", {}).get("full_name"),
                    "img_src": photo.get("img_src"),
                    "earth_date": photo.get("earth_date")
                }
                for photo in photos
            ]
        }
        return str(result)
    except Exception as e:
        return f"Error fetching Mars rover photos: {str(e)}"

@tool
def get_neo_feed(start_date: Optional[str] = None, end_date: Optional[str] = None) -> str:
    """
    Get Near Earth Objects (asteroids) approaching Earth.
    
    Args:
        start_date: Start date in YYYY-MM-DD format. Defaults to today.
        end_date: End date in YYYY-MM-DD format. Defaults to 7 days from start_date.
    
    Returns:
        JSON string with asteroid approach data.
    """
    try:
        if not start_date:
            start_date = datetime.now().strftime("%Y-%m-%d")
        if not end_date:
            end_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        url = f"{settings.nasa_base_url}/neo/rest/v1/feed"
        params = {
            "start_date": start_date,
            "end_date": end_date,
            "api_key": settings.nasa_api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        element_count = data.get("element_count", 0)
        near_earth_objects = data.get("near_earth_objects", {})
        
        result = {
            "element_count": element_count,
            "dates": list(near_earth_objects.keys()),
            "sample_objects": []
        }
        
        for date_key in list(near_earth_objects.keys())[:3]:
            objects = near_earth_objects[date_key][:2]
            for obj in objects:
                result["sample_objects"].append({
                    "name": obj.get("name"),
                    "estimated_diameter_km": obj.get("estimated_diameter", {}).get("kilometers", {}),
                    "potentially_hazardous": obj.get("is_potentially_hazardous_asteroid"),
                    "close_approach_date": obj.get("close_approach_data", [{}])[0].get("close_approach_date")
                })
        
        return str(result)
    except Exception as e:
        return f"Error fetching NEO feed: {str(e)}"

@tool
def get_epic_images(date: Optional[str] = None) -> str:
    """
    Get Earth Polychromatic Imaging Camera (EPIC) images.
    
    Args:
        date: Date in YYYY-MM-DD format. If not provided, returns most recent.
    
    Returns:
        JSON string with EPIC image data.
    """
    try:
        if date:
            url = f"{settings.nasa_base_url}/EPIC/api/natural/date/{date}"
        else:
            url = f"{settings.nasa_base_url}/EPIC/api/natural"
        
        params = {"api_key": settings.nasa_api_key}
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if not data:
            return "No EPIC images available for this date"
        
        images = data[:3]
        result = {
            "date": date or "most_recent",
            "total_images": len(data),
            "images": [
                {
                    "identifier": img.get("identifier"),
                    "caption": img.get("caption"),
                    "date": img.get("date"),
                    "image": img.get("image")
                }
                for img in images
            ]
        }
        return str(result)
    except Exception as e:
        return f"Error fetching EPIC images: {str(e)}"

@tool
def search_nasa_images(query: str, media_type: Optional[str] = None) -> str:
    """
    Search NASA's Image and Video Library.
    
    Args:
        query: Search query.
        media_type: Filter by media type (image, video, audio).
    
    Returns:
        JSON string with search results.
    """
    try:
        url = "https://images-api.nasa.gov/search"
        params = {"q": query}
        
        if media_type:
            params["media_type"] = media_type
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        items = data.get("collection", {}).get("items", [])[:5]
        
        result = {
            "query": query,
            "total_hits": len(items),
            "items": [
                {
                    "title": item.get("data", [{}])[0].get("title"),
                    "description": item.get("data", [{}])[0].get("description", "")[:200],
                    "date_created": item.get("data", [{}])[0].get("date_created"),
                    "media_type": item.get("data", [{}])[0].get("media_type"),
                    "center": item.get("data", [{}])[0].get("center"),
                    "href": item.get("href")
                }
                for item in items
            ]
        }
        return str(result)
    except Exception as e:
        return f"Error searching NASA images: {str(e)}"

@tool
def get_earth_imagery(lat: float, lon: float, date: Optional[str] = None, dim: float = 0.025) -> str:
    """
    Get Landsat 8 Earth imagery for a location.
    
    Args:
        lat: Latitude.
        lon: Longitude.
        date: Date in YYYY-MM-DD format.
        dim: Width and height of image in degrees.
    
    Returns:
        JSON string with Earth imagery data.
    """
    try:
        url = f"{settings.nasa_base_url}/planetary/earth/imagery"
        params = {
            "lon": lon,
            "lat": lat,
            "dim": dim,
            "api_key": settings.nasa_api_key
        }
        
        if date:
            params["date"] = date
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        result = {
            "location": {"lat": lat, "lon": lon},
            "image_url": response.url,
            "date": date or "most_recent"
        }
        return str(result)
    except Exception as e:
        return f"Error fetching Earth imagery: {str(e)}"

@tool
def get_donki_notifications(start_date: Optional[str] = None, end_date: Optional[str] = None, type_filter: str = "all") -> str:
    """
    Get space weather notifications from DONKI (Database Of Notifications, Knowledge, Information).
    
    Args:
        start_date: Start date in YYYY-MM-DD format.
        end_date: End date in YYYY-MM-DD format.
        type_filter: Event type (all, FLR, SEP, CME, IPS, MPC, GST, RBE, report).
    
    Returns:
        JSON string with space weather notifications.
    """
    try:
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        
        url = f"{settings.nasa_base_url}/DONKI/notifications"
        params = {
            "startDate": start_date,
            "endDate": end_date,
            "type": type_filter,
            "api_key": settings.nasa_api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        notifications = data[:5] if isinstance(data, list) else []
        
        result = {
            "start_date": start_date,
            "end_date": end_date,
            "total_notifications": len(notifications),
            "notifications": [
                {
                    "messageType": notif.get("messageType"),
                    "messageID": notif.get("messageID"),
                    "messageIssueTime": notif.get("messageIssueTime"),
                    "messageBody": notif.get("messageBody", "")[:200]
                }
                for notif in notifications
            ]
        }
        return str(result)
    except Exception as e:
        return f"Error fetching DONKI notifications: {str(e)}"


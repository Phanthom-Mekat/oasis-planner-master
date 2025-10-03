#!/usr/bin/env python3
"""Explore VNP46A3 HDF5 file structure to find the correct dataset path."""

import h5py
from pathlib import Path

vnp_dir = Path("../../data/VNP46A3")
vnp_files = sorted(vnp_dir.glob("*.h5"))

if not vnp_files:
    print("No VNP46A3 files found!")
    exit(1)

latest_file = vnp_files[-1]
print(f"Exploring: {latest_file.name}")
print("=" * 80)

def print_structure(name, obj):
    indent = "  " * name.count('/')
    if isinstance(obj, h5py.Dataset):
        print(f"{indent}📊 {name} (Dataset, shape: {obj.shape}, dtype: {obj.dtype})")
    elif isinstance(obj, h5py.Group):
        print(f"{indent}📁 {name} (Group)")

with h5py.File(latest_file, 'r') as f:
    print("\n🔍 Full HDF5 Structure:")
    print("-" * 80)
    f.visititems(print_structure)
    
    print("\n" + "=" * 80)
    print("\n🎯 Looking for nighttime lights datasets...")
    print("-" * 80)
    
    found_datasets = []
    def find_ntl(name, obj):
        if isinstance(obj, h5py.Dataset):
            if any(keyword in name.lower() for keyword in ['ntl', 'night', 'dnb', 'brdf', 'radiance']):
                found_datasets.append(name)
                print(f"✅ Found: {name}")
                print(f"   Shape: {obj.shape}")
                print(f"   Type: {obj.dtype}")
                print(f"   Attributes: {list(obj.attrs.keys())}")
                print()
    
    f.visititems(find_ntl)
    
    if found_datasets:
        print("\n" + "=" * 80)
        print(f"\n🎉 Found {len(found_datasets)} potential dataset(s)!")
        print("\nRecommended path to use:")
        print(f"  '{found_datasets[0]}'")
        
        # Test reading the data
        print("\n📖 Testing data read...")
        try:
            dataset = f[found_datasets[0]]
            data = dataset[100:150, 100:150]  # Read small sample
            print(f"✅ Successfully read sample data")
            print(f"   Sample shape: {data.shape}")
            print(f"   Min: {data.min():.2f}, Max: {data.max():.2f}, Mean: {data.mean():.2f}")
        except Exception as e:
            print(f"❌ Error reading: {e}")
    else:
        print("\n❌ No nighttime lights datasets found!")
        print("\nAll available datasets:")
        def list_all_datasets(name, obj):
            if isinstance(obj, h5py.Dataset):
                print(f"  - {name}")
        f.visititems(list_all_datasets)

print("\n" + "=" * 80)


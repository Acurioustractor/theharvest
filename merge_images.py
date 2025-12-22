import json
import os

def merge_data():
    # Load existing data
    json_path = '/home/ubuntu/witta-swot-analysis/client/src/data/accommodation-full.json'
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Load new data with images
    # The file content might be truncated or have issues, so we'll try to load it carefully
    upload_path = '/home/ubuntu/upload/pasted_content.txt'
    try:
        with open(upload_path, 'r') as f:
            new_content = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {upload_path}: {e}")
        return

    # Create a mapping of normalized name to images
    images_map = {}
    for item in new_content.get('listings', []):
        name = item.get('propertyName', '').lower().strip()
        images = [img['value'] for img in item.get('images', []) if img.get('value')]
        if name and images:
            images_map[name] = images

    # Update featured listings
    for item in data.get('featured', []):
        name = item.get('name', '').lower().strip()
        # Try exact match or partial match
        if name in images_map:
            item['images'] = images_map[name]
        else:
            # Fallback: check if any key in images_map is part of the name
            for key, val in images_map.items():
                if key in name or name in key:
                    item['images'] = val
                    break

    # Update directory listings
    for item in data.get('directory', []):
        name = item.get('name', '').lower().strip()
        if name in images_map:
            item['images'] = images_map[name]
        else:
             for key, val in images_map.items():
                if key in name or name in key:
                    item['images'] = val
                    break

    # Save updated data
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Successfully merged images into accommodation-full.json")

if __name__ == "__main__":
    merge_data()

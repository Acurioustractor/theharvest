import json
import os

def process_enterprises():
    input_path = '/home/ubuntu/upload/extract-data-2025-12-22.json'
    output_path = '/home/ubuntu/witta-swot-analysis/client/src/data/enterprises.json'
    
    try:
        with open(input_path, 'r') as f:
            raw_data = json.load(f)
    except Exception as e:
        print(f"Error reading input file: {e}")
        return

    processed_enterprises = []
    
    # Categories mapping based on business names/types
    def categorize(name):
        name_lower = name.lower()
        if any(x in name_lower for x in ['market', 'store', 'shop']):
            return 'Markets & Retail'
        elif any(x in name_lower for x in ['art', 'studio', 'gallery', 'pottery', 'dyeing']):
            return 'Arts & Crafts'
        elif any(x in name_lower for x in ['cottage', 'retreat', 'cabin', 'stay', 'accommodation']):
            return 'Accommodation'
        elif any(x in name_lower for x in ['plumbing', 'service', 'patios', 'welding']):
            return 'Services & Trades'
        elif any(x in name_lower for x in ['club', 'tennis', 'recreational']):
            return 'Community & Sports'
        else:
            return 'Local Business'

    for entity in raw_data.get('entities', []):
        # Skip if name is missing
        if not entity.get('name'):
            continue
            
        enterprise = {
            "id": entity['name'].lower().replace(' ', '-').replace("'", ""),
            "name": entity['name'],
            "category": categorize(entity['name']),
            "description": f"Local enterprise located in {entity.get('physical_address', 'Witta')}.",
            "address": entity.get('physical_address'),
            "contact": {
                "phone": entity.get('phone_number'),
                "email": entity.get('contact_email'),
                "website": entity.get('website_url')
            },
            "image": "/images/placeholder-enterprise.jpg" # Placeholder, will need real images or generic category images
        }
        processed_enterprises.append(enterprise)

    # Sort by name
    processed_enterprises.sort(key=lambda x: x['name'])

    with open(output_path, 'w') as f:
        json.dump({"enterprises": processed_enterprises}, f, indent=2)
    
    print(f"Successfully processed {len(processed_enterprises)} enterprises into {output_path}")

if __name__ == "__main__":
    process_enterprises()

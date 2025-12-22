import json
import csv

def enrich_enterprises():
    current_data_path = '/home/ubuntu/witta-swot-analysis/client/src/data/enterprises.json'
    research_data_path = '/home/ubuntu/research_enterprises.json'
    output_path = '/home/ubuntu/witta-swot-analysis/client/src/data/enterprises.json'

    try:
        with open(current_data_path, 'r') as f:
            current_data = json.load(f)
        
        with open(research_data_path, 'r') as f:
            research_data = json.load(f)
    except Exception as e:
        print(f"Error reading files: {e}")
        return

    # Create a lookup map from research data
    # The input in research data was the search query, which contained the name.
    # We'll try to match by checking if the enterprise name is in the input string.
    research_map = {}
    for item in research_data.get('results', []):
        input_query = item.get('input', '').lower()
        output = item.get('output', {})
        if output:
            research_map[input_query] = output

    updated_count = 0
    
    for enterprise in current_data.get('enterprises', []):
        name_lower = enterprise['name'].lower()
        
        # Find matching research data
        matched_output = None
        for query, output in research_map.items():
            # Check if the enterprise name (or a significant part of it) is in the query
            if name_lower in query:
                matched_output = output
                break
        
        if matched_output:
            # Update description if available and longer than current
            new_desc = matched_output.get('description')
            if new_desc and len(new_desc) > len(enterprise.get('description', '')):
                enterprise['description'] = new_desc
            
            # Update image if available and not a placeholder
            new_image = matched_output.get('image_url')
            if new_image and new_image != "NA":
                enterprise['image'] = new_image
            
            # Update social links
            if 'contact' not in enterprise:
                enterprise['contact'] = {}
            
            fb = matched_output.get('facebook')
            if fb and fb != "NA":
                enterprise['contact']['facebook'] = fb
                
            insta = matched_output.get('instagram')
            if insta and insta != "NA":
                enterprise['contact']['instagram'] = insta
                
            updated_count += 1

    with open(output_path, 'w') as f:
        json.dump(current_data, f, indent=2)
    
    print(f"Successfully enriched {updated_count} enterprises in {output_path}")

if __name__ == "__main__":
    enrich_enterprises()

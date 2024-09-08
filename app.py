from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import main as MAIN
import rag as RAG
import json
import requests
from PIL import Image
from io import BytesIO
import time

app = Flask(__name__)
CORS(app)  # 启用跨域支持

@app.route('/hello', methods=['GET'])
def hello():
    return "Hello World!"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    query = data['query']
    design_doc = data['design_doc']
    result = MAIN.query_analysis(query, design_doc)
    return jsonify(result)

@app.route('/api/complete', methods=['POST'])
def complete():
    data = request.json
    query_alaysis_result =json.loads(data)
    query = query_alaysis_result['Query']
    print("query", query)
    # rag
    rag_results = RAG.search_in_meilisearch(query, query_alaysis_result['Requirement'])
    print("rag_results done")
    #domain
    domain_knowledge = rag_results.get('hits', [])
    init_solution = MAIN.domain_expert_system(query, domain_knowledge)
    print("domain done")

    #interdisciplinary
    iterated_solution = MAIN.interdisciplinary_expert_system(query, domain_knowledge, init_solution)
    print("interdisciplinary done")

    # Evaluation Expert
    final_solution = MAIN.evaulation_expert_system(query, domain_knowledge, init_solution, iterated_solution)
    print("evaluation done")
    final_solution = eval(final_solution) 
    print("fina; solution", final_solution)

    target_user =  query_alaysis_result['Target User'] if 'Target User' in query_alaysis_result else 'null'
    print("==============Drawing================")
    for i in range(len(final_solution['solutions'])):
        
        image = MAIN.drawing_expert_system(target_user, final_solution['solutions'][i]["Use Case"])
        final_solution['solutions'][i]["image_url"] = image.url
        timestamp = int(time.time())
        final_solution['solutions'][i]["image_name"] = timestamp
        print("draw image {}: {}". format(i, image.url))
        # save img
        
        save_path = f"./interface/public/{timestamp}.png"
        response = requests.get(image.url)
        response.raise_for_status()
        image_pillow = Image.open(BytesIO(response.content))
        image_pillow.save(save_path)
        image_pillow.save(f"./static/{timestamp}.png")
        

    # final_solution = eval(final_solution)
    print("done")

    return jsonify(final_solution)

if __name__ == '__main__':
    app.run(debug=True)
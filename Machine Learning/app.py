from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import pickle

with open("college", "rb") as f:
    mp = pickle.load(f)

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/", methods=["GET"])
def index_get():
    return render_template("base.html")

@app.route("/predict", methods=["POST"])
@cross_origin(supports_credentials=True)
def predict():
    data = request.get_json()
    payload = data['data']
    print(payload)
    output1 = mp.predict([payload[0]])
    output2 = mp.predict([payload[1]])
    output3 = mp.predict([payload[2]])
    output4 = mp.predict([payload[3]])
    output5 = mp.predict([payload[4]])
    print([output1, output2, output3, output4, output5])
    return  '{} {} {} {} {}'.format(output1, output2, output3, output4, output5)
    # ans = {
    #     "1": output1,
    #     "2": output2,
    #     "3": output3,
    #     "4": output4,
    #     "5": output5
    # }
    # return ans

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=7000)
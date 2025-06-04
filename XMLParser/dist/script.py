from bigxml import Parser,xml_handle_element,xml_handle_text
from rules import rules
import json
file_path='./mapsmall.xml'
ref_map={}
loc_map={}
def addToMap(category,node):
    global ref_map
    props={}
    @xml_handle_element("nd")
    def handleNd(node):
        yield node.attributes["ref"]
    if(category=="node"):
        props={
        "lat":node.attributes["lat"],
        "lon":node.attributes["lon"]
        }
    elif(category=="way"):
        props={
        "refs":list(node.iter_from(handleNd))
        }
    try:
        ref_map[category][node.attributes["id"]]=props
    except:
        ref_map[category]={}
        ref_map[category][node.attributes["id"]]=props
@xml_handle_element("osm","node")
def handleNode(node):
    addToMap("node",node)
@xml_handle_element("osm","way")
def handleNode(node):
    addToMap("way",node)
if(__name__=="__main__"):
    with open(file_path,"rb")as f:
        for item in Parser(f).iter_from(handleNode):pass
    with open("out.json","w")as f:
        f.write(json.dumps(ref_map))

from bigxml import Parser,xml_handle_element,xml_handle_text
import shapely
from rules import rules,checkRules
import json
file_path='./map.xml'
ref_map={}
loc_map={}
def addLocation(category,lat,lon):
    try:
        loc_map[category].append([float(lat),float(lon)])
    except:
        loc_map[category]=[]
        loc_map[category].append([float(lat),float(lon)])
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
    rule=checkRules(node)
    if(rule!=None):
        addLocation(rule["out"],node.attributes["lat"],node.attributes["lon"])
@xml_handle_element("osm","way")
def handleWay(node):
    addToMap("way",node)
@xml_handle_element("osm","relation")
def handleRelation(node):
    multipoly=[]
    def parseMember(node):
        # global multipoly
        if(node.attributes["role"]!="outer"):
            return
        # dereference the way
        points=[]
        try:# I hate how python errors instead of returning null like a sane language
            points=ref_map["way"][node.attributes["ref"]]["refs"]
            # print(f"points: {points}")
        except:
            return
        coordinates=[]
        for point in points:
            # try {
            dereference=ref_map["node"][point]
            coordinates.append((
            dereference["lon"],
            dereference["lat"],
            ))
            # } except {}
        multipoly.append(coordinates)
    tags=[]
    @xml_handle_element("tag")
    def handleTag(node):
        tags.append(node)
    @xml_handle_element("member")
    def handleMember(node):
        parseMember(node)
    for item in node.iter_from(handleTag,handleMember):pass
    rule=checkRules(node,tags)
    if(rule!=None):
        linestrings=[]
        for line in multipoly:
            linestrings.append(shapely.LineString(line))
        shape=shapely.polygonize(linestrings)
        try:
            centroid=shape.geoms[0].exterior.centroid
            addLocation(rule["out"],centroid.y,centroid.x)
        except:pass
if(__name__=="__main__"):
    with open(file_path,"rb")as f:
        for item in Parser(f).iter_from(handleNode,handleWay,handleRelation):pass
    with open("locations.json","w")as f:
        f.write(json.dumps(loc_map))

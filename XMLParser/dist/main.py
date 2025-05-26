import xml.etree.ElementTree as ET
import json
header="""
<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API 0.7.62.5 1bd436f1">
<note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
<meta osm_base="2025-05-19T01:32:42Z"/>
"""
footer="""
</osm>
"""
def anyContentsMatch(arr1,arr2):
    return True in[x in arr1 for x in arr2]
def trimFatToFile():
    # First step is to trim out nodes with no tags to help prevent python from crashing
    out=""
    with open("./map.xml","r")as xml:
        for line in xml.readlines():
            # print(f"|{line}| {line.startswith("  <node ")} {line.endswith("\"/>\n")}")
            if(not(line.startswith("  <node ")and line.endswith("\"/>\n"))):
                # print("appended")
                out+=line
    with open("./out.xml","w")as xml:
        xml.write(out)
def objectify():
    tree=ET.parse("./out.xml")
    root=tree.getroot()
    le_map=[
    {
    "tags":[
    ["railway","station"],
    ["subway","yes"]
    ],
    "out":"subway"
    },{
    "tags":[
    ["railway","station"],
    ["light_rail","yes"]
    ],
    "out":"greenline"
    },{
    "tags":[
    ["railway","station"],
    ["train","yes"]
    ],
    "out":"cr"
    },{
    "tags":[
    ["healthcare","hospital"]
    ],
    "out":"hospital"
    },{
    "tags":[
    ["brand","Raising Cane's"]
    ],
    "out":"raisingcanes"
    }
    ]
    out={}
    for key in le_map:
        out[key["out"]]=[]
    for item in root.findall('node'):
        for condition in le_map:
            # Iterate over every tag
            contains=0
            for tag in item:
                # if the tag matches a condition, increment contains
                for requirement in condition["tags"]:
                    if(tag.attrib["k"]==requirement[0]and tag.attrib["v"]==requirement[1]):
                        contains+=1
            # if contains is the number of tags, every tag matched
            if(contains==len(condition["tags"])):
                out[condition["out"]].append([float(item.attrib["lat"]),float(item.attrib["lon"])])
    with open("locations.json","w")as file:
        file.write(json.dumps(out))
if __name__=="__main__":
    # trimFatToFile()
    objectify()

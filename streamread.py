import json
import re
f = open("raw_data.txt", "r")
for line in f:
    print(line.replace(r'\t',''))
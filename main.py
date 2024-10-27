import socket
import xml.etree.ElementTree as ET
import pyautogui

PORT = 4242
ADDRESS = ("127.0.0.1", PORT)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(ADDRESS)

s.send(str.encode('<SET ID="SCREEN_SIZE" X="0" Y="0" WIDTH="2560" HEIGHT="1080"/>\r\n'))
s.send(str.encode('<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n'))
s.send(str.encode('<SET ID="CALIBRATE_START" STATE="1" />\r\n'))



while True:
    rxdat = s.recv(1024)
    print(bytes.decode(rxdat))
    if (bytes.decode(rxdat).__contains__('"CALIB_RESULT"')):
        s.send(str.encode('<SET ID="CALIBRATE_SHOW" STATE="0" />\r\n'))
        break


s.send(str.encode('<SET ID="ENABLE_SEND_CURSOR" STATE="1" />\r\n'))
s.send(str.encode('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n'))
s.send(str.encode('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n'))

while 1:
    rxdat = s.recv(1024)
    xml_string=bytes.decode(rxdat)
    try:
        root = ET.fromstring(xml_string)
        if root.tag == "REC":
            fpogx = float(root.attrib.get('FPOGX'))
            fpogy = float(root.attrib.get('FPOGY'))
            pyautogui.moveTo(fpogx*2560, fpogy*1080)
    except:
        continue



s.close()
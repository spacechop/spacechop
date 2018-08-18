Strategy for Highest throughput (C++11)
Issues: - Takes some 400ms to start the C program.

Typical performance measured: - 1183563 bytes in 2.99878 seconds, after program is loaded, 5 faces detected (image not scaled). throughput: 394.681 Kbps - 1183563 bytes in 3.87 seconds, without program loaded, just called with file as an argument, 5 faces detected (image not scaled). throughput: 304.257 Kbps - 35048 bytes in 0.114808 seconds, after program is loaded, 4 faces detected (image scaled to 500x). throughput: 305.274 Kbps < - 35048 bytes in 0.56 seconds, without program loaded, just called with file as an argument, 4 faces detected (image scaled 500x). throughput: 62.585 Kbps

Highest face detection throughput can be achieved by spawning a face_detect process, it will load the program and then wait for input of the file path. When received it will load the image, process the image with face detection, and return a JSON with all faces [{face:{ x, y, width, height }, features:[{ x , y }, ...]].

In the transformer: 1. create face detector in build phase (this will give time for the detector to load) 2. in the resize > facedetect (thumb, fill, crop, gravity:face) phase start detecting faces. 3. in the finalize phase, kill the process.

Face detection finds the center of a face and it's size, the features of a face defines the locations of chin, eyes, mouth and nose. Checkout facedetect.cpp for more details.

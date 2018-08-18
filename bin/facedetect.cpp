// The contents of this file are in the public domain. See LICENSE_FOR_EXAMPLE_PROGRAMS.txt
/*

    This example program shows how to find frontal human faces in an image.  In
    particular, this program shows how you can take a list of images from the
    command line and display each on the screen with red boxes overlaid on each
    human face.

    The examples/faces folder contains some jpg images of people.  You can run
    this program on them and see the detections by executing the following command:
        ./face_detection_ex faces/*.jpg


    This face detector is made using the now classic Histogram of Oriented
    Gradients (HOG) feature combined with a linear classifier, an image pyramid,
    and sliding window detection scheme.  This type of object detector is fairly
    general and capable of detecting many types of semi-rigid objects in
    addition to human faces.  Therefore, if you are interested in making your
    own object detectors then read the fhog_object_detector_ex.cpp example
    program.  It shows how to use the machine learning tools which were used to
    create dlib's face detector.


    Finally, note that the face detector is fastest when compiled with at least
    SSE2 instructions enabled.  So if you are using a PC with an Intel or AMD
    chip then you should enable at least SSE2 instructions.  If you are using
    cmake to compile this program you can enable them by using one of the
    following commands when you create the build project:
        cmake path_to_dlib_root/examples -DUSE_SSE2_INSTRUCTIONS=ON
        cmake path_to_dlib_root/examples -DUSE_SSE4_INSTRUCTIONS=ON
        cmake path_to_dlib_root/examples -DUSE_AVX_INSTRUCTIONS=ON
    This will set the appropriate compiler options for GCC, clang, Visual
    Studio, or the Intel compiler.  If you are using another compiler then you
    need to consult your compiler's manual to determine how to enable these
    instructions.  Note that AVX is the fastest but requires a CPU from at least
    2011.  SSE4 is the next fastest and is supported by most current machines.
*/


#include <dlib/image_processing/frontal_face_detector.h>
// #include <dlib/image_processing/render_face_detections.h>
#include <dlib/image_processing.h>
#include <dlib/image_io.h>
#include <iostream>
#include <string>
#include <sstream>
#include <ctime>

using namespace dlib;
using namespace std;

// ----------------------------------------------------------------------------------------

string makeFaceVectorRectanglesToJSON(const std::vector<rectangle>& detected_faces) {
  std::ostringstream json;
  json << "[";
  // for i, face_rect in enumerate(detected_faces) {
  for (int i = 0; i < detected_faces.size(); i++){
    rectangle face_rect = detected_faces[i];
    json << "{";
    json << "\"x\":" << face_rect.left() / 2 << ",";
    json << "\"y\":" << face_rect.top() / 2 << ",";
    json << "\"width\":" << face_rect.width() / 2 << ",";
    json << "\"height\":" << face_rect.height() / 2;
    json << "}";
    if (i < detected_faces.size() - 1) {
      json << ",";
    }
  }
  json << "]";
  return json.str();
}

string makeFaceRectanglesToJSON(const rectangle& face_rect) {
  std::ostringstream json;
  json << "{";
  json << "\"x\":" << face_rect.left() / 2 << ",";
  json << "\"y\":" << face_rect.top() / 2 << ",";
  json << "\"width\":" << face_rect.width() / 2 << ",";
  json << "\"height\":" << face_rect.height() / 2;
  json << "}";
  return json.str();
}

string makeFaceFeaturesShapeToJSON(const full_object_detection& shape) {
  std::ostringstream json;
  json << "[";
  for (int i = 0; i < shape.num_parts(); i++) {
    point part = shape.part(i);
    json << "{";
    json << "\"x\":" << part.x() / 2 << ",";
    json << "\"y\":" << part.y() / 2;
    json << "}";
    if (i < shape.num_parts() - 1) {
      json << ",";
    }
  }
  json << "]";
  return json.str();
}

int main(int argc, char** argv)
{
    try
    {
        // if (argc == 1)
        // {
        //     cout << "Give some image files as arguments to this program." << endl;
        //     return 0;
        // }

        frontal_face_detector detector = get_frontal_face_detector();
        // image_window win;
        shape_predictor sp;
        deserialize("/usr/share/dlib/build/shape_predictor_68_face_landmarks.dat") >> sp;

        string input = "";
        // cout << "Please enter an image:\n>";
        getline(cin, input);

        // cout << "processing image " << input << endl;
        clock_t t0 = clock();
        array2d<unsigned char> img;
        load_image(img, input);
        clock_t t1 = clock();
        // Make the image bigger by a factor of two.  This is useful since
        // the face detector looks for faces that are about 80 by 80 pixels
        // or larger.  Therefore, if you want to find faces that are smaller
        // than that then you need to upsample the image as we do here by
        // calling pyramid_up().  So this will allow it to detect faces that
        // are at least 40 by 40 pixels in size.  We could call pyramid_up()
        // again to find even smaller faces, but note that every time we
        // upsample the image we make the detector run slower since it must
        // process a larger image.
        pyramid_up(img);
        clock_t t2 = clock();

        // Now tell the face detector to give us a list of bounding boxes
        // around all the faces it can find in the image.
        std::vector<rectangle> detected_faces = detector(img);
        clock_t t3 = clock();

        // cout << "Number of faces detected: " << dets.size() << endl;

        std::ostringstream json;
        json << "[";
        for (int i = 0; i < detected_faces.size(); i++) {
          const rectangle face_rect = detected_faces[i];
          const full_object_detection shape = sp(img, face_rect);
          const string face = makeFaceRectanglesToJSON(face_rect);
          const string features = makeFaceFeaturesShapeToJSON(shape);
          json << "{";
          json << "\"face\":" << face << ",";
          json << "\"features\":" << features;
          json << "}";
          if (i < detected_faces.size() - 1) {
            json << ",";
          }
          // cout << "number of parts: "<< shape.num_parts() << endl;
          //cout << "pixel position of first part:  " << shape.part(0) << endl;
          //cout << "pixel position of second part: " << shape.part(1) << endl;
          // if (shape.num_parts() == 5) {
          //   cout << "{x: " << shape.part(0) << ",y:"<< shape.part(1) << "}" << endl;
          //   cout << "{x: " << shape.part(1) << ",y:"<< shape.part(4) << "}" << endl;
          //   cout << "{x: " << shape.part(4) << ",y:"<< shape.part(3) << "}" << endl;
          //   cout << "{x: " << shape.part(3) << ",y:"<< shape.part(2) << "}" << endl;
          // } else {
          //   cout << "// Around Chin. Ear to Ear" << endl;
          //   for (unsigned long i = 1; i <= 16; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //
          //   cout << "// Line on top of nose" << endl;
          //   for (unsigned long i = 28; i <= 30; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //
          //   cout << "// left eyebrow" << endl;
          //   for (unsigned long i = 18; i <= 21; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "// Right eyebrow" << endl;
          //   for (unsigned long i = 23; i <= 26; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "// Bottom part of the nose" << endl;
          //   for (unsigned long i = 31; i <= 35; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "// Line from the nose to the bottom part above" << endl;
          //   cout << "{x: " << shape.part(30) << ",y:"<< shape.part(35) << "}" << endl;
          //
          //   cout << "// Left eye" << endl;
          //   for (unsigned long i = 37; i <= 41; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "{x: " << shape.part(36) << ",y:"<< shape.part(41) << "}" << endl;
          //
          //   cout << "// Right eye" << endl;
          //   for (unsigned long i = 43; i <= 47; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "{x: " << shape.part(42) << ",y:"<< shape.part(47) << "}" << endl;
          //
          //   cout << "// Lips outer part" << endl;
          //   for (unsigned long i = 49; i <= 59; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "{x: " << shape.part(48) << ",y:"<< shape.part(59) << "}" << endl;
          //
          //   cout << "// Lips inside part" << endl;
          //   for (unsigned long i = 61; i <= 67; ++i)
          //     cout << "{x: " << shape.part(i) << ",y:"<< shape.part(i-1) << "}" << endl;
          //   cout << "{x: " << shape.part(60) << ",y:"<< shape.part(67) << "}" << endl;
          // }
        }
        json << "]";
        cout << json.str() << endl;

        // cout << "load " << double(t1 - t0) / CLOCKS_PER_SEC << endl;
        // cout << "pyramid " << double(t2 - t1) / CLOCKS_PER_SEC << endl;
        // cout << "detection " << double(t3 - t2) / CLOCKS_PER_SEC << endl;
        // cout << "total " << double(t3 - t0) / CLOCKS_PER_SEC << endl;

        // return 0;

        // // Loop over all the images provided on the command line.
        // for (int i = 1; i < argc; ++i)
        // {
        //     cout << "processing image " << argv[i] << endl;
        //     array2d<unsigned char> img;
        //     load_image(img, argv[i]);
        //     // Make the image bigger by a factor of two.  This is useful since
        //     // the face detector looks for faces that are about 80 by 80 pixels
        //     // or larger.  Therefore, if you want to find faces that are smaller
        //     // than that then you need to upsample the image as we do here by
        //     // calling pyramid_up().  So this will allow it to detect faces that
        //     // are at least 40 by 40 pixels in size.  We could call pyramid_up()
        //     // again to find even smaller faces, but note that every time we
        //     // upsample the image we make the detector run slower since it must
        //     // process a larger image.
        //     pyramid_up(img);
        //
        //     // Now tell the face detector to give us a list of bounding boxes
        //     // around all the faces it can find in the image.
        //     std::vector<rectangle> dets = detector(img);
        //
        //     cout << "Number of faces detected: " << dets.size() << endl;
        //
        //     JSON(dets);
        //
        //     return 0;
        // }
    }
    catch (exception& e)
    {
        cout << "\nexception thrown!" << endl;
        cout << e.what() << endl;
    }
}

// ----------------------------------------------------------------------------------------

#include<iostream>
#include<opencv2/opencv.hpp>

using namespace std;
using namespace cv;

int main()
{
    VideoCapture capture(0);

    capture.set(CV_CAP_PROP_FRAME_WIDTH, 640);
    capture.set(CV_CAP_PROP_FRAME_HEIGHT, 480);
    
    if(!capture.isOpened()){
        cout << "Failed to connect to the camera." << endl;
        return -1;
    }

    Mat frame;
    capture >> frame;
    if(frame.empty()){
        cout << "Failed to capture an image" << endl;
        return -2;
    }

    imwrite("capture.png", frame);

    return 0;
}
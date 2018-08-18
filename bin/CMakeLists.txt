#
#  _______ _    _ _____  _____     _____  _____
# |__   __| |  | |_   _|/ ____|   |_   _|/ ____|       /\
#    | |  | |__| | | | | (___       | | | (___        /  \
#    | |  |  __  | | |  \___ \      | |  \___ \      / /\ \
#    | |  | |  | |_| |_ ____) |    _| |_ ____) |    / ____ \
#    |_|__|_|_ |_|_____|_____/__  |_____|_____/    /_/  _ \_\
#   |__   __| |  | |__   __/ __ \|  __ \|_   _|   /\   | |
#      | |  | |  | |  | | | |  | | |__) | | |    /  \  | |
#      | |  | |  | |  | | | |  | |  _  /  | |   / /\ \ | |
#      | |  | |__| |  | | | |__| | | \ \ _| |_ / ____ \| |____
#      |_|   \____/   |_|  \____/|_|  \_\_____/_/    \_\______|
#
#
#    _____  ______          _____      _______ _    _ ______
#   |  __ \|  ____|   /\   |  __ \    |__   __| |  | |  ____|
#   | |__) | |__     /  \  | |  | |      | |  | |__| | |__
#   |  _  /|  __|   / /\ \ | |  | |      | |  |  __  |  __|
#   | | \ \| |____ / ____ \| |__| |      | |  | |  | | |____
#   |_|__\_\______/_/_ __\_\_____/__ _   |_|__|_|_ |_|______|_ _ _
#  / ____/ __ \|  \/  |  \/  |  ____| \ | |__   __/ ____| | | | | |
# | |   | |  | | \  / | \  / | |__  |  \| |  | | | (___   | | | | |
# | |   | |  | | |\/| | |\/| |  __| | . ` |  | |  \___ \  | | | | |
# | |___| |__| | |  | | |  | | |____| |\  |  | |  ____) | |_|_|_|_|
#  \_____\____/|_|  |_|_|  |_|______|_| \_|  |_| |_____/  (_|_|_|_)
#
#
#
# This is a CMake makefile.  CMake is a tool that helps you build C++ programs.
# You can download CMake from http://www.cmake.org.  This CMakeLists.txt file
# you are reading builds dlib's example programs.
#


cmake_minimum_required(VERSION 2.8.12)
# Every project needs a name.  We call this the "examples" project.
project(examples)


# Tell cmake we will need dlib.  This command will pull in dlib and compile it
# into your project.  Note that you don't need to compile or install dlib.  All
# cmake needs is the dlib source code folder and it will take care of everything.
add_subdirectory(../dlib dlib_build)


# The next thing we need to do is tell CMake about the code you want to
# compile.  We do this with the add_executable() statement which takes the name
# of the output executable and then a list of .cpp files to compile.  Here we
# are going to compile one of the dlib example programs which has only one .cpp
# file, assignment_learning_ex.cpp.  If your program consisted of multiple .cpp
# files you would simply list them here in the add_executable() statement.
#add_executable(assignment_learning_ex assignment_learning_ex.cpp)
# Finally, you need to tell CMake that this program, assignment_learning_ex,
# depends on dlib.  You do that with this statement:
#target_link_libraries(assignment_learning_ex dlib::dlib)



# To compile this program all you need to do is ask cmake.  You would type
# these commands from within the directory containing this CMakeLists.txt
# file:
#   mkdir build
#   cd build
#   cmake ..
#   cmake --build . --config Release
#
# The cmake .. command looks in the parent folder for a file named
# CMakeLists.txt, reads it, sets up everything needed to build program.  Also,
# note that CMake can generate Visual Studio or XCode project files.  So
# if instead you had written:
#   mkdir build
#   cmake .. -G "Visual Studio 14 2015 Win64" ..
#
# You would be able to open the resulting visual studio project and compile and
# edit the example programs within the visual studio IDE.  CMake can generate a
# lot of different types of IDE projects.  Run the cmake -h command to see a list
# of arguments to -G to see what kinds of projects cmake can generate for you.
# It probably includes your favorite IDE in the list.




#################################################################################
#################################################################################
#  A CMakeLists.txt file can compile more than just one program.  So below we
#  tell it to compile the other dlib example programs using pretty much the
#  same CMake commands we used above.
#################################################################################
#################################################################################


# Since there are a lot of examples I'm going to use a macro to simply this
# CMakeLists.txt file.  However, usually you will create only one executable in
# your cmake projects and use the syntax shown above.
macro(add_build name)
   add_executable(${name} ${name}.cpp)
   target_link_libraries(${name} dlib::dlib )
endmacro()

#here we apply our macros
add_build(facedetect)

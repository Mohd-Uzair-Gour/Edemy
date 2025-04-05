import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }]
          ]
        }
      });
    }
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title?.trim()) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title.trim(),
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length + 1,
        };
        setChapters(prev => [...prev, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(prev => prev.filter(chapter => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(prev => prev.map(chapter =>
        chapter.chapterId === chapterId
          ? { ...chapter, collapsed: !chapter.collapsed }
          : chapter
      ));
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(prev => prev.map(chapter => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            chapterContent: chapter.chapterContent.filter((_, idx) => idx !== lectureIndex)
          };
        }
        return chapter;
      }));
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle.trim() || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl.trim()) {
      toast.error("Please fill all lecture details");
      return;
    }

    const currentChapter = chapters.find(ch => ch.chapterId === currentChapterId);
    const newLecture = {
      lectureId: uniqid(),
      ...lectureDetails,
      lectureDuration: Number(lectureDetails.lectureDuration),
      lectureOrder: currentChapter.chapterContent.length + 1,
    };

    setChapters(prev => prev.map(chapter =>
      chapter.chapterId === currentChapterId
        ? {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture]
          }
        : chapter
    ));

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !coursePrice || !image) {
      toast.error("Please fill all required fields and select a thumbnail");
      return;
    }

    if (chapters.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }

    try {
      setIsLoading(true);
      const courseData = {
        courseTitle: courseTitle.trim(),
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount) || 0,
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCourseTitle("");
    setCoursePrice("");
    setDiscount("");
    setImage(null);
    setChapters([]);
    if (quillRef.current) quillRef.current.root.innerHTML = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-lg space-y-6">
        <div>
          <label className="text-lg font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder="Enter course title"
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-lg font-medium text-gray-700">Course Description</label>
          <div ref={editorRef} className="mt-2 border border-gray-300 rounded-md min-h-[200px]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-lg font-medium text-gray-700">Course Price</label>
            <input
              type="number"
              min="0"
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-gray-700">Course Thumbnail</label>
            <label htmlFor="thumbnailImage" className="flex items-center mt-2 cursor-pointer">
              <img src={assets.file_upload_icon} alt="Upload" className="w-8 h-8 mr-2" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <span className="text-blue-500">Upload Image</span>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Thumbnail Preview"
                className="mt-2 w-full max-w-sm rounded-md"
              />
            )}
          </div>
        </div>

        <div>
          <label className="text-lg font-medium text-gray-700">Discount %</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.chapterId} className="border-b py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={assets.dropdown_icon}
                  alt="Toggle"
                  className={`w-4 h-4 mr-2 cursor-pointer transform transition-all ${chapter.collapsed && "-rotate-90"}`}
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                />
                <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{chapter.chapterContent.length} Lectures</span>
                <img
                  src={assets.cross_icon}
                  alt="Remove"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                />
              </div>
            </div>

            {!chapter.collapsed && (
              <div className="mt-4 space-y-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div key={lecture.lectureId} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins
                    </span>
                    <div className="flex items-center space-x-2">
                      <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                        Link
                      </a>
                      <span className="text-xs text-gray-500">
                        {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt="Remove Lecture"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                      />
                    </div>
                  </div>
                ))}
                <div
                  className="mt-2 text-blue-500 cursor-pointer"
                  onClick={() => handleLecture("add", chapter.chapterId)}
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-4 text-blue-500 cursor-pointer" onClick={() => handleChapter("add")}>
          + Add Chapter
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Add Lecture</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Lecture Title</label>
                  <input
                    type="text"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Lecture URL</label>
                  <input
                    type="url"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Free Preview</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="text-gray-600 border border-gray-300 rounded-md px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addLecture}
                  className="bg-blue-500 text-white rounded-md px-6 py-2"
                >
                  Add Lecture
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 bg-blue-500 text-white rounded-md px-6 py-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isLoading ? "Adding Course..." : "ADD COURSE"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
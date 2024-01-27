import React, { useState, useRef, useEffect } from "react";
import styles from "./portfolio.module.css";
import Image from "next/image";
import axios from "axios";

const Portfolio = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setisEditFormOpen] = useState(false);
  const [project, setProject] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const fileInputRef = useRef();
  const placeholderImages = new Array(3).fill(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imagesEdit = [project.image1, project.image2, project.image3];

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    try {
      const response = await axios.get(apiurl, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        setProjects(response.data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch projects", response);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.bodycontent}>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg pb-24"></span>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    const apiurl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/portfolio`;
    const headers = {
      auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
    };

    try {
      const response = await axios.post(apiurl, formData, {
        headers,
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Successfully created project");
      } else {
        console.error("Failed to update projects", response);
      }
    } catch (error) {
      console.error("Failed to update projects", error);
    }

    setTitle("");
    setDescription("");
    setUrl("");
    setImages([]);
    setIsFormOpen(false);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file) {
        setImages((oldImages) => {
          if (editingImageIndex !== null) {
            const newImages = [...oldImages];
            newImages[editingImageIndex] = file;
            return newImages;
          } else {
            return [...oldImages, file];
          }
        });
        setEditingImageIndex(null);
      }
    });
    event.target.value = null;
  };

  const handleEditClick = (index) => {
    const project = projects[index];
    setProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setUrl(project.url);
    images[0] = project.image1;
    images[1] = project.image2;
    images[2] = project.image3;
    setIsFormOpen(true);
    setisEditFormOpen(true);
  };

  const handleDeleteClick = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageDelete = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setImages((oldImages) => oldImages.filter((_, i) => i !== index));
  };

  const handleImageEdit = (event, index) => {
    event.preventDefault();
    event.stopPropagation(); 
    setEditingImageIndex(index);
    fileInputRef.current.click();
  };

  return (
    <div className={styles.bodycontent}>
      <div className={`${isFormOpen ? styles.projectContainerOpen : ""}`}>
        <div
          className={`${styles.addProjectContainer} ${
            isFormOpen
              ? styles.addProjectContainerOpen
              : styles.addProjectContainerClose
          }`}
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setTitle("");
            setDescription("");
            setUrl("");
            setImages([]);
          }}
        >
          <i className="fa-solid fa-plus"></i>
          <h3>Add new project</h3>
        </div>
        <div
          className={`${styles.formcontainer} ${isFormOpen ? styles.open : ""}`}
        >
          {isFormOpen && (
            <div>
              <form
                onSubmit={handleFormSubmit}
                className={styles.addprojectform}
              >
                <div className={styles.addprojectformcontent}>
                  <div className={styles.addprojectforminputs}>
                    <div>
                      <h3>Project Title</h3>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                      />
                    </div>
                    <div>
                      <h3>Project URL</h3>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL"
                        required
                      />
                    </div>
                    <div>
                      <h3>Project Description</h3>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                        className={styles.description}
                      />
                    </div>
                    <div className={styles.addprojectformbuttons}>
                      <button
                        type="button"
                        onClick={handleFileButtonClick}
                        className={styles.selectimages}
                      >
                        <div>
                          <i class="fa-solid fa-image"></i>
                          Select Images
                        </div>
                      </button>
                      <div className={styles.addprojectformactionbuttons}>
                        <button
                          onClick={() => {
                            setIsFormOpen(!isFormOpen);
                            setisEditFormOpen(!isEditFormOpen);
                          }}
                          className={styles.cancelproject}
                        >
                          <div>
                            <i class="fa-solid fa-ban"></i>
                            Cancel
                          </div>
                        </button>
                        {!isEditFormOpen ? (
                          <button type="submit" className={styles.addproject}>
                            <div>
                              <i class="fa-solid fa-right-to-bracket"></i>
                              Submit
                            </div>
                          </button>
                        ) : (
                          <button
                            className={styles.addproject}
                            onClick={handleEditFormSubmit}
                          >
                            <div>
                              <i class="fa-solid fa-right-to-bracket"></i>
                              Edit
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isEditFormOpen ? (
                    <div className={styles.formimages}>
                      {placeholderImages.map((_, index) => (
                        <div key={index} className={styles.formimage}>
                          {images[index] ? (
                            <div className={styles.imagecontainer}>
                              <Image
                                src={images[index]}
                                alt={`Preview ${index}`}
                                layout="fill"
                                objectFit="cover"
                              />
                              <div className={styles.imageactions}>
                                <button
                                  type="none"
                                  onClick={(event) =>
                                    handleImageDelete(event, index)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  type="none"
                                  onClick={(event) =>
                                    handleImageEdit(event, index)
                                  }
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={styles.placeholderImage}
                              onClick={handleFileButtonClick}
                            >
                              <i class="fa-solid fa-image"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.formimages}>
                      {placeholderImages.map((_, index) => (
                        <div key={index} className={styles.formimage}>
                          {images[index] ? (
                            <div className={styles.imagecontainer}>
                              <Image
                                src={images[index]}
                                alt={`Preview ${index}`}
                                layout="fill"
                                objectFit="cover"
                              />
                              <div className={styles.imageactions}>
                                <button
                                  onClick={() => handleImageDelete(index)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button onClick={() => handleImageEdit(index)}>
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={styles.placeholderImage}
                              onClick={handleFileButtonClick}
                            >
                              <i class="fa-solid fa-image"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </form>
            </div>
          )}
        </div>
      </div>
      <div className={`${isFormOpen ? styles.formopen : ""}`}>
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          className={`${styles.tableprojects}
            `}
        >
          <thead class="">
            <tr>
              <th scope="col" class="px-6 py-3">
                Thumbnail
              </th>
              <th scope="col" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3">
                Description
              </th>
              <th scope="col" class="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) =>
              displayProjects({
                project,
                index,
                handleEditClick,
                handleDeleteClick,
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const displayProjects = ({
  project,
  index,
  handleEditClick,
  handleDeleteClick,
}) => {
  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  };

  return (
    <>
      <tr
        key={index}
        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <td class="px-6 py-4">
          {project.image1 && (
            <div className={styles.displayprojectimage}>
              <Image
                src={project.image1}
                alt={`Project ${index}`}
                width={50}
                height={50}
              />
            </div>
          )}
        </td>
        <td class="px-6 py-4">
          <h3>{project.title}</h3>
        </td>
        <td class="px-6 py-4">
          <h3>{truncateDescription(project.description, 25)}</h3>
        </td>
        <td class="px-6 py-4">
          <div className={styles.projectcrud}>
            <button
              onClick={() => handleEditClick(index)}
              className={styles.edit}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(index)}
              className={styles.delete}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default Portfolio;

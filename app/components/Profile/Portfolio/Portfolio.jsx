import React, { useState, useRef } from "react";
import styles from "./portfolio.module.css";
import Image from "next/image";

const Portfolio = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const fileInputRef = useRef();
  const placeholderImages = new Array(3).fill(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (editingProjectIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = {
        title,
        description,
        url,
        images,
      };
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      setProjects([...projects, { title, description, url, images }]);
    }

    setTitle("");
    setDescription("");
    setUrl("");
    setImages([]);

    setIsFormOpen(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((oldImages) => {
            if (oldImages.length >= 3) {
              alert("You can only upload 3 images");
              return oldImages;
            }
            if (editingImageIndex !== null) {
              const newImages = [...oldImages];
              newImages[editingImageIndex] = reader.result;
              return newImages;
            } else {
              return [...oldImages, reader.result];
            }
          });
          setEditingImageIndex(null);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = null;
  };

  const handleEditClick = (index) => {
    const project = projects[index];
    setTitle(project.title);
    setDescription(project.description);
    setUrl(project.url);
    setImages(project.images);
    setIsFormOpen(true);
    setEditingProjectIndex(index);
  };

  const handleDeleteClick = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageDelete = (index) => {
    setImages((oldImages) => oldImages.filter((_, i) => i !== index));
  };

  const handleImageEdit = (index) => {
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
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <i className="fa-solid fa-plus"></i>
          <h3>Add new project</h3>
        </div>
        <div
          className={`${styles.formcontainer} ${isFormOpen ? styles.open : ""}`}
        >
          {isFormOpen && (
            <div>
              <div className={styles.divider}></div>
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
                          onClick={() => setIsFormOpen(!isFormOpen)}
                          className={styles.cancelproject}
                        >
                          <div>
                            <i class="fa-solid fa-ban"></i>
                            Cancel
                          </div>
                        </button>
                        <button type="submit" className={styles.addproject}>
                          <div>
                            <i class="fa-solid fa-right-to-bracket"></i>
                            Submit
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
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
                              <button onClick={() => handleImageDelete(index)}>
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
              <div className={styles.divider}></div>
            </div>
          )}
        </div>
      </div>
      {projects.map((project, index) => (
        <div key={index} className={styles.displayproject}>
          <div className={styles.displayprojecttitleimage}>
            {project.images[0] && (
              <div className={styles.image}>
                <Image
                  src={project.images[0]}
                  alt={`Project ${index}`}
                  width={50}
                  height={50}
                  className={styles.formimage}
                />
              </div>
            )}
            <h2>{project.title}</h2>
          </div>
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
        </div>
      ))}
    </div>
  );
};

export default Portfolio;

import React, { useState, useRef } from "react";
import styles from "../Profile.module.css";
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
  const placeholderImages = new Array(5).fill(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (editingProjectIndex !== null) {
      // Update the project
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
      // Add the new project to the list of projects
      setProjects([...projects, { title, description, url, images }]);
    }

    // Reset the form inputs
    setTitle("");
    setDescription("");
    setUrl("");
    setImages([]);

    // Close the form
    setIsFormOpen(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((oldImages) => {
            if (editingImageIndex !== null) {
              // Replace the image being edited with the new image
              const newImages = [...oldImages];
              newImages[editingImageIndex] = reader.result;
              return newImages;
            } else {
              // Add the new image to the end of the array
              return [...oldImages, reader.result];
            }
          });
          // Reset the editing image index
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
    // Save the index of the image being edited to a state
    setEditingImageIndex(index);
    // Trigger the file input click event to select a new image
    fileInputRef.current.click();
  };

  return (
    <div className={styles.bodycontent}>
      <div
        className={styles.buttoncontainer}
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        <i className="fa-solid fa-plus"></i>
        <h3 className={styles.addProject}>Add new project</h3>
      </div>

      {isFormOpen && (
        <div>
          <div className={styles.divider}></div>
          <form onSubmit={handleFormSubmit} className={styles.addprojectform}>
            <div className={styles.titleurl}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL"
                required
              />
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
              className={styles.description}
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <div className={styles.buttons}>
              <button type="button" onClick={handleFileButtonClick}>
                Select Images
              </button>
              <button type="submit">Submit</button>
            </div>
          </form>
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
                  <div className={styles.placeholderImage}>
                    <i className="fa-solid fa-question"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.divider}></div>
        </div>
      )}
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

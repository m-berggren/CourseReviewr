# Backend and Frontend Template

Latest version: <https://git.chalmers.se/courses/dit342/group-00-web>

This template refers to itself as `group-00-web`. In your project, use your group number in place of `00`.

## Project Structure

| File                                              | Purpose                     | What you do?                             |
| ------------------------------------------------- | --------------------------- | ---------------------------------------- |
| `server/`                                       | Backend server code         | All your server code                     |
| [server/README.md](server/README.md)                 | Everything about the server | **READ ME** carefully!             |
| `client/`                                       | Frontend client code        | All your client code                     |
| [client/README.md](client/README.md)                 | Everything about the client | **READ ME** carefully!             |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.gitlab.com/ce/gitlab-basics/start-using-git.html#add-your-git-username-and-set-your-email)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
    >
* [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT342 course group: <https://git.chalmers.se/courses/dit342>
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/ee/ssh/)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under <https://git.chalmers.se/profile/keys>
    * Make sure the email you use to commit is registered under <https://git.chalmers.se/profile/emails>
  * Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

#### CourseReviewr

This system allows users to share and view reviews about online courses they have taken or are taking. Users can add courses from different course providers and rate them, optionally with leaving comments.

Users are able to create different lists with courses they want to enroll in or courses they have already taken, as well get recommendation of courses that are in their area of interest.

### Pages

* Homepage: Displays various recommended courses depending on a user's interests (if any, or if logged in), the amount of reviews and the review rating of each course. Underneath the courses are the latest reviews made. There is a typeahead search bar for findind existing courses and possibility to select popular topics to filter on.

* Courses page: A page where all courses are listed, sorted on review account but possible other sorting options are on course provider, difficulty, average rating, amount of reviews and release year. There's a search bar and possibility to filter on providers and topics as well, depending on preference.

* Single course page: All the detailed information about one course, including rating and all the reviews listed underneath.

* Create course page: Here you fill in all the necessary information to create a course. Editing a course after creation is not possible at release 1 so there are several mandatory fields to fill in.

* Create review page: A page for creating a review of a course. A created review is stored in each course page and in the users reviews page.

* Reviews page: This is the page where a user has all their reviews listed. The reviews may be edited and you can visit a reviewed course from there.

* Course list page: A page where a user can store various different course lists with courses, following their interests or for future note.

* Profile page: Here the user can change contact information such as photo, e-mail, interests and update password.

* Sign in & Register pages: Basic sign in and register pages. You need to be signed in order to be able to create a course, create a review, enter reviews page and course lists page.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/OnlineCourseReviewer-ER.png)

## Advanced feature ideas

Using Amazon Simple Storage Service (S3) to store and retrieve images for our system, users can upload images for a course, when reviewing course, and in user profile.

Backend Implementation

1. AWS S3 Configuration:
   * AWS SDK was used to interact with S3.
   * AWS credentials (e.g., accessKeyId, secretAccessKey, region) are configured using environment variables.
2. API Endpoints:
   * Generate Upload URL (generateUploadUrl): Generates a signed URL to allow the client to upload an image to S3 directly.
   * Generate Download URL (generateDownloadUrl): Provides a signed URL for downloading the image from S3.
   * Delete Object (deleteOneObject): Deletes an image from S3, typically called when a profile photo or course photo is updated to remove old images and save space.
3. The endpoints are exposed in the aws.routes.js file to handle requests such as generating URLs or deleting objects. The AWS-related functionality is encapsulated in the aws.controller.js.
4. AWS S3 Bucket Operations:
   * Images are uploaded using pre-signed URLs generated by the backend. These URLs allow the client to interact with S3 directly for uploading without exposing secret keys.
   * Images are deleted by calling the deleteOneObject endpoint when a new image replaces an old one.

Frontend Implementation

1. Image Upload:
   * Image Resizing: Before uploading, images are resized on the client-side using a canvas element. This reduces image size, improves upload speed, and limits the image dimensions (e.g., 300x200).
   * API Integration:
     * The frontend component uses Api.js to request an upload URL by calling the /aws/generate-upload-url endpoint.
     * Once the signed URL is obtained, the image is uploaded directly to AWS S3 using an HTTP PUT request.
   * Form Handling: For profile pictures, once the image is uploaded to S3, the image key is saved to the user’s profile via an API call.
2. Image Retrieval:
   * Image Display Component: S3ImageDisplay.vue is used to display images from S3.
     * If a valid image key exists, a download URL is fetched from S3 using the /aws/generate-download-url endpoint, and this URL is used as the src for the image.
     * If no image key exists, a placeholder image is shown.
3. Image Deletion:
   * When an image is updated (e.g., profile picture), the old image is deleted by calling the /aws/delete-object endpoint with the key of the old image.

Database Implementation

1. Storing Image References:
   * The database stores the S3 keys as string for each image.
   * For example:
     * A user's profile image key (user.photo) is stored in the user document.
     * A course image key (course.photo) is stored in the course document.
2. Associations:
   * When a user or course photo is updated, the S3 key for the new image is saved in the database, replacing the old key.
   * This ensures that the database maintains a reference to the correct image in S3, and the frontend can easily retrieve the associated image using these keys.

## Teaser (MS3)
![CourseReviewrTeaser](./images/CourseReviewrTeaser.png)
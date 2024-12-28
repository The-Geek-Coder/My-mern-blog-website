import { Alert, Button, Modal, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function formatDateToDDMMYYYY(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  //The 2 in padStart(2, '0') specifies that the final length of the string should be 2 characters, and '0' is the padding character used to achieve that length.
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postDeleteError, setPostDeleteError] = useState(null);
  const [postDeleteConsentInp, setPostDeleteConsentInp] = useState(null);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setShowMore(true);
        const response = await fetch(
          `/api/posts/getPosts/?userId=${currentUser._id}`
        );
        const responseData = await response.json();
        console.log(responseData.posts);
        if (!response.ok) return;

        setUserPosts(responseData.posts);
        if (responseData.posts.length < 9) setShowMore(false);
        console.log(userPosts, "Hello there guys");
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userPosts.length === 0) {
      setShowMore(false);
    }
    if (currentUser.isAdmin) fetchPost();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `/api/posts/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) return;
      if (responseData.posts.length < 9) setShowMore(false);
      console.log(userPosts, "Hello there guys");
      setUserPosts((prev) => [...prev, ...responseData.posts]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    //    alert(postIdToDelete);
    try {
      const response = await fetch(
        `/api/posts/delete/${currentUser._id}/${postIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postDeleteConsent: postDeleteConsentInp }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        setPostDeleteError(responseData.msg);
        return;
      }
      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
      setShowModal(false);
      postDeleteConsentInp("");
    } catch (error) {}
  };

  return (
    <>
      <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar-track-slate-700 scrollbar-thumb-slate-500 md:w-[70vw]">
        {currentUser.isAdmin && userPosts.length > 0 ? (
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>
                Date Updated <div className="mt-1">(dd/mm/yyyy)</div>
              </Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>edit</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {formatDateToDDMMYYYY(post.updatedAt)}
                  </Table.Cell>

                  <NavLink to={`/posts/${post.slug}`}>
                    <Table.Cell>
                      <img
                        className="h-10 w-20 object-cover bg-gray-500"
                        src={post.image}
                        alt={post.title}
                      />
                    </Table.Cell>
                  </NavLink>

                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <NavLink className={"h-full"} to={`/posts/${post.slug}`}>
                      {post.title}
                    </NavLink>
                  </Table.Cell>

                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-500 cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>

                  <NavLink
                    className={
                      "text-teal-500 hover:underline hover:cursor-pointer"
                    }
                    to={`/updatePost/${post._id}`}
                  >
                    <Table.Cell>
                      <span>Edit</span>
                    </Table.Cell>
                  </NavLink>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        ) : (
          <>
            <p className="font-extrabold dark:text-gray-400 text-gray-500 text-center text-3xl pt-7">
              You Have No Posts Yet.
            </p>
            {currentUser.isAdmin && (
              <NavLink to="/createPost">
                <Button
                  type="button"
                  gradientDuoTone={"tealToLime"}
                  size={"xl"}
                  className="w-full mt-5"
                >
                  Create a Post
                </Button>
              </NavLink>
            )}
          </>
        )}
        {showMore && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 text-center self-center text-sm py-4 m-1 dark:bg-gray-700 bg-slate-100 rounded-lg"
          >
            Show More
          </button>
        )}
      </div>

      <Modal
        show={showModal}
        onClose={() => {
          setPostDeleteError(null);
          setShowModal(false);
        }}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-md text-gray-500 dark:text-gray-400">
              To delete this post type:{" "}
              <span className="font-bold text-red-600 rounded-md block">
                "I WanT To DeLeTe ThIS poSt"
              </span>{" "}
              as a form of consent
            </h3>
          </div>
          <form>
            {postDeleteError && (
              <Alert color={"failure"} className="mx-auto my-2 w-[100%]">
                {postDeleteError}
              </Alert>
            )}
            <TextInput
              value={postDeleteConsentInp}
              required
              onChange={(e) => {
                setPostDeleteConsentInp(e.target.value);
              }}
              placeholder="Give consent"
            />
            <p className="text-sm text-gray-500 font-bold mt-2">
              Note: All data will be permanently lost upon deletion
            </p>
            <div className="flex justify-between mt-5">
              <Button
                type="submit"
                color={"failure"}
                onClick={handleDeletePost}
              >
                Yes I am sure
              </Button>
              <Button
                color={"success"}
                onClick={() => {
                  setShowModal(false);
                  setPostDeleteError(null);
                }}
              >
                No, Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashPost;

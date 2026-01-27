import React, {useEffect} from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";

const Delete = ({id, handleFunction }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const handleDelete = () => {
    handleFunction();
    onClose()
  }
  const initTooltip = () => {
    const deleteButton = document.getElementById(`delete-button-${id}`);
    if (deleteButton) {
      new window.bootstrap.Tooltip(deleteButton, {
        title: "Delete",
        placement: "top",
        trigger: "hover",
      });
    }
  };

  useEffect(() => {
    initTooltip();
  }, [id]);
  return (
    <>
      <AiFillDelete
        id={`delete-button-${id}`}
        onClick={onOpen}
        style={{ fontSize: "20px", cursor: "pointer", color: "#ff385c" }}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete
            </AlertDialogHeader>
            
            <AlertDialogBody>
              Are you sure? You want to delete it.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Delete;

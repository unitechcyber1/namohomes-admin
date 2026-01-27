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
import { RxCrossCircled } from "react-icons/rx";

const Desable = ({ id, handleFunction, isEnabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const handleReject = () => {
    handleFunction();
    onClose()
  }
  const initTooltipforDisable = () => {
    const disableButton = document.getElementById(`disable-button-${id}`);
    if (disableButton) {
      new window.bootstrap.Tooltip(disableButton, {
        title: "Disable",
        placement: "top",
        trigger: "hover",
      });
    }
  };
useEffect(() => {
  initTooltipforDisable()
},[id])
  if (!isEnabled) {
    return (
      <button disabled style={{ fontSize: "20px", cursor: "not-allowed", color: "gray" }}>
        <RxCrossCircled id={`disable-button-${id}`}/>
      </button>
    );
  }
  return (
    <>
     <button  style={{ fontSize: "20px", cursor: "pointer", color: "#444" }}>
     <RxCrossCircled
     id={`disable-button-${id}`}
        onClick={onOpen}
      />
      </button>
      

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Disable
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You want to Disable this Project.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReject} ml={3}>
                Disable
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Desable;

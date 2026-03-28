import React, { useState, useEffect, Fragment } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { GpState } from "../../../context/context";
import { uploadFiles } from "../../../services/mediaService";

const BuiderImage = () => {
  const [progress, setProgress] = useState(0);
  const { builderImage, setBuilderImage, editBuilder, isBuilderEditable } =
    GpState();
  const [isUploaded, setIsUploaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (
      isBuilderEditable &&
      editBuilder?.images?.length &&
      !builderImage?.length
    ) {
      setBuilderImage(editBuilder.images);
    }
  }, [
    isBuilderEditable,
    editBuilder?.images,
    builderImage?.length,
    setBuilderImage,
  ]);

  const removePreviewImage = (index) => {
    const updatedImages = [...(builderImage || [])];
    updatedImages.splice(index, 1);
    setBuilderImage(updatedImages);
  };

  const handleInputByClick = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const data = await uploadFiles(files, {
        compressImages: true,
        onProgress: (percent) => setProgress(percent),
      });

      if (!data || data.length === 0) {
        toast({
          title: "Upload failed",
          description: "Check your file format and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      const previewData = data.map((fileData, index) => ({
        image: fileData,
        name: files[index]?.name ?? "",
        alt: files[index]?.name ?? "",
      }));

      setBuilderImage((prev) => [...(prev || []), ...previewData]);
      setIsUploaded(true);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setProgress(0);
    }
  };

  const handleAltChange = (event, index) => {
    const value = event.target.value;
    setBuilderImage((prev) => {
      const arr = [...(prev || [])];
      if (arr[index]) arr[index] = { ...arr[index], alt: value };
      return arr;
    });
  };

  return (
    <div className="saas-card">
      <div className="saas-card-header">
        <div>
          <div className="saas-card-title">Gallery images</div>
          <div className="saas-card-subtitle">
            Upload images used on the builder profile. Set alt text for
            accessibility.
          </div>
        </div>
      </div>
      <div className="saas-card-body">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/40 px-6 py-10 text-center transition hover:border-slate-300 hover:bg-slate-50">
          <FaUpload className="mb-2 text-2xl text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            Click to upload images
          </span>
          <span className="mt-1 text-xs text-slate-500">PNG, JPG — multiple files</span>
          <input
            type="file"
            multiple
            accept="image/*"
            aria-label="Upload builder gallery images"
            onChange={handleInputByClick}
            className="sr-only"
          />
        </label>

        {progress ? (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Uploading… {progress}%
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isUploaded ? (
          <p className="mt-3 text-sm font-medium text-emerald-700">Upload complete</p>
        ) : null}

        <div className="mt-6 overflow-x-auto overscroll-x-contain">
          <TableContainer>
            <Table variant="simple" className="min-w-[720px]">
              <Thead className="bg-slate-50">
                <Tr>
                  <Th w="12">#</Th>
                  <Th>Preview</Th>
                  <Th>Name</Th>
                  <Th>Alt text</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(builderImage || []).map((img, index) => (
                  <Fragment key={index}>
                    <Tr className="hover:bg-slate-50/60">
                      <Td className="font-medium text-slate-700">{index + 1}</Td>
                      <Td>
                        <img
                          src={img.image?.s3_link ?? img.image}
                          alt=""
                          className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
                        />
                      </Td>
                      <Td>
                        <input
                          type="text"
                          className="form-control rounded-lg border border-slate-200 text-sm"
                          readOnly
                          value={img.name ?? ""}
                        />
                      </Td>
                      <Td>
                        <input
                          type="text"
                          className="form-control min-w-[180px] rounded-lg border border-slate-200 text-sm"
                          value={(img.alt ?? "").split(".")[0]}
                          onChange={(event) => handleAltChange(event, index)}
                        />
                      </Td>
                      <Td textAlign="right">
                        <button
                          type="button"
                          onClick={() => removePreviewImage(index)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-600 shadow-sm hover:bg-rose-50"
                          aria-label="Remove image"
                        >
                          <AiFillDelete className="text-lg" />
                        </button>
                      </Td>
                    </Tr>
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        {(!builderImage || builderImage.length === 0) && (
          <p className="mt-4 text-center text-sm text-slate-500">
            No gallery images yet. Upload files above.
          </p>
        )}
      </div>
    </div>
  );
};

export default BuiderImage;

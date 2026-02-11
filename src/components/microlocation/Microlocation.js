import React, { useEffect, useMemo, useState } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import Delete from "../delete/Delete";
import EditMicrolocation from "./EditMicrolocation";
import ImageUpload from "../../ImageUpload";
import Select from "react-select";
import { uploadFile } from "../../services/Services";

import {
  getStatesByCountry,
  getCitiesByState,
  getMicrolocations,
  createMicrolocation,
  deleteMicrolocationById
} from "services/microlocationService";
import { getCountries } from "services/countryService";

import {
  Button, Spinner, Table, Thead, Tbody,
  Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure,
  useToast
} from "@chakra-ui/react";

function Microlocation() {

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [microlocations, setMicrolocations] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [curPage, setCurPage] = useState(1);

  /* ---------- Fetch ---------- */

  const loadAll = async () => {
    setLoading(true);
    const [countryData, microData] = await Promise.all([
      getCountries(),
      getMicrolocations()
    ]);
    setCountries(countryData);
    setMicrolocations(microData);
    setLoading(false);
  };
  console.log(countries)
  useEffect(() => { loadAll(); }, []);

  /* ---------- Cascading ---------- */

  const handleCountry = async (opt) => {
    setSelectedCountry(opt);
    setSelectedState(null);
    setSelectedCity(null);
    setStates(await getStatesByCountry(opt.value));
  };

  const handleState = async (opt) => {
    setSelectedState(opt);
    setSelectedCity(null);
    setCities(await getCitiesByState(opt.value));
  };

  /* ---------- Upload ---------- */

  const handleUpload = async (files) => {
    await uploadFile(files, setProgress, setIsUploaded, (d) =>
      setImages(prev => prev.concat(d))
    );
  };

  /* ---------- Save ---------- */

  const handleSave = async () => {
    if (!form.name || !selectedCountry || !selectedState || !selectedCity) {
      toast({ title: "Fill required fields", status: "warning" });
      return;
    }

    await createMicrolocation({
      ...form,
      image: images[0],
      country: selectedCountry.value,
      state: selectedState.value,
      city: selectedCity.value,
    });

    toast({ title: "Saved", status: "success" });

    setForm({ name:"", description:"" });
    setImages([]);
    onClose();
    loadAll();
  };

  /* ---------- Delete ---------- */

  const handleDelete = async (id) => {
    await deleteMicrolocationById(id);
    toast({ title:"Deleted", status:"success" });
    loadAll();
  };

  /* ---------- Derived ---------- */

  const filtered = useMemo(() =>
    !search ? microlocations :
    microlocations.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    ), [search, microlocations]
  );

  const perPageNum = Number(perPage);
  const pageData = filtered.slice(
    (curPage-1)*perPageNum,
    curPage*perPageNum
  );

  /* ---------- Options ---------- */

  const countryOptions = countries.map(c => ({value:c._id,label:c.name}));
  const stateOptions = states.map(s => ({value:s._id,label:s.name}));
  const cityOptions = cities.map(c => ({value:c._id,label:c.name}));

  /* ---------- UI ---------- */

  return (
    <div className="mx-5 mt-3">
      <Mainpanelnav />
      <div className="d-flex my-3 align-items-center justify-content-between">
        <h2 className=" mb-0">SEO Module</h2>
      <Button  className="addnew-btn"  onClick={onOpen}>ADD NEW</Button>
      </div>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Microlocation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Select options={countryOptions} value={selectedCountry}
              onChange={handleCountry} placeholder="Country"/>

            <Select options={stateOptions} value={selectedState}
              onChange={handleState} placeholder="State"/>

            <Select options={cityOptions} value={selectedCity}
              onChange={setSelectedCity} placeholder="City"/>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
              className="property-input"
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}
              className="property-input"
            />

            <ImageUpload
              images={images}
              setImages={setImages}
              progress={progress}
              setProgress={setProgress}
              uploadFile={handleUpload}
              isUploaded={isUploaded}
            />

          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Search */}
      <div className="row mt-2 project-card2">
      <div className="row">
      <div className="col-md-4 px-4">
      <input
        className="uniform-select-seo"
        placeholder="Search"
        value={search}
        onChange={e=>{setSearch(e.target.value);setCurPage(1);}}
      />
      </div>
          </div>
            </div>

      {/* Table */}
     <div className="table-box ">
             <TableContainer  overflowX="hidden">
               <Table variant="simple" >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Country</Th>
              <Th>State</Th>
              <Th>City</Th>
              <Th>Status</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan={7}><Spinner/></Td></Tr>
            ) : pageData.map(m => (
              <Tr key={m._id}>
                <Td>{m.name}</Td>
                <Td>{m.country?.name}</Td>
                <Td>{m.state?.name}</Td>
                <Td>{m.city?.name}</Td>
                <Td>{m.active ? "Active":"Inactive"}</Td>
                <Td>
                  <EditMicrolocation
                    id={m._id}
                    microlocations={m}
                  />
                </Td>
                <Td>
                  <Delete handleFunction={()=>handleDelete(m._id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
    </div>
  );
}

export default Microlocation;

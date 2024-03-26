import React, { useState } from 'react';
import { Typography, Box, Button, Modal, Fade, Backdrop, TextField } from '@mui/material';
import { QUOTE_BASE_STATUS } from 'src/context/Quotes/defs';
import { getBase64 } from 'src/utils/fileToB64';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddQuoteModal = ({ open, onClose, onSave }) => {
  const [contractor, setContractor] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  console.log({ uploadedFiles });
  const handleSave = async () => {
    const quoteToSave = {
      contractor,
      status: QUOTE_BASE_STATUS.UNAPPROVED,
      quote_amount: quoteAmount ? parseFloat(quoteAmount).toFixed(2) : 0, // Round to two decimal places
      files: uploadedFiles > 0 ? await Promise.all(uploadedFiles.map(getBase64)) : [], // assuming encodedFiles is populated
    };

    onSave(quoteToSave);
  };
  const fileInputRef = React.useRef();

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileDelete = (fileToDelete) => {
    setUploadedFiles((prevFiles) => Array.from(prevFiles).filter((file) => file !== fileToDelete));
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Add a new quote
          </Typography>
          <TextField
            id="contractor"
            label="Contractor"
            variant="standard"
            sx={{ mt: 2, display: 'block' }}
            value={contractor}
            fullWidth
            onChange={(event) => setContractor(event.target.value)}
          />
          <TextField
            id="quote-amount"
            label="USD"
            variant="standard"
            type="number"
            sx={{ mt: 2, display: 'block' }}
            value={quoteAmount}
            fullWidth
            onChange={(event) => {
              let val = event.target.value;
              // remove leading 0 for non-decimal numbers
              if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
                val = val.slice(1);
              }
              setQuoteAmount(val);
            }}
          />
          <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={openFileDialog}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-arrow-up"
              width="32"
              height="32"
              viewBox="0 0 30 25"
              strokewidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 8l-4 4" />
              <path d="M12 8v8" />
              <path d="M16 12l-4 -4" />
            </svg>
            Upload quote files
            <input
              ref={fileInputRef}
              id="quote-upload"
              type="file"
              hidden
              multiple
              accept=".pdf,.xlsx,.csv,image/*" // Accepts PDF, XLSX, CSV and all image formats
              onChange={(event) => setUploadedFiles([...uploadedFiles, ...event.target.files])}
            />
          </Button>
          {uploadedFiles.map((file, index) => {
            console.log(file, index);
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography>{file.name}</Typography>
                <Button onClick={() => handleFileDelete(file)} sx={{ ml: 2 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </Box>
            );
          })}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="success"
              sx={{ width: '48%', mt: 2 }}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              sx={{ width: '48%', mt: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddQuoteModal;

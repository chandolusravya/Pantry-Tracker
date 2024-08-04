'use client';
import { useState, useEffect } from "react";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0); // State for price

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
  };

  const addItem = async (item, price) => {
    if (!item || isNaN(price)) {
      alert("Item name is empty or price is invalid");
      return;
    }
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    // Convert price to number
    const numericPrice = parseFloat(price);

    if (docSnap.exists()) {
      const { quantity, price: existingPrice } = docSnap.data();
      // Maintain the existing price if it's already set
      await setDoc(docRef, { quantity: quantity + 1, price: existingPrice + numericPrice });
    } else {
      await setDoc(docRef, { quantity: 1, price: numericPrice });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, price } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1, price });
      }
    }
    await updateInventory();
  };

  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = inventory.filter(({ name }) =>
      name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h4">
        Pantry Management App
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2, width: '50%' }}
        />
        <Button variant="contained" onClick={handleOpen}>Add new item</Button>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          width={400}
          bgcolor={"white"}
          border="2px solid #000 "
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Item Price"
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(parseFloat(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemPrice);
                setItemName('');
                setItemPrice(0);
                handleClose();
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" color="#333">
            Inventory items
          </Typography>
        </Box>
        <Stack width="800px" height="600px" spacing={3} overflow="auto">
          {filteredInventory.map(({ name, quantity, price }) => (
            <Box
              key={name}
              width="100%"
              height="50px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h6" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="center">
                ${parseFloat(price).toFixed(2)}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name, price)}>ADD</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>REMOVE</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}






/*'use client'
import Image from "next/image";
import { useState, useEffect } from "react"; //state variables for client side
import { Box, Button, Modal,Stack,TextField,Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query, deleteDoc,doc, getDoc, setDoc } from "firebase/firestore";
export default function Home() {
  //inventory management helper functions:
  const [inventory, setInventory] = useState([])
  const [open,setOpen] = useState(false)
  const [itemName, setItemName] =useState('') //to store item name-set to empty string(default value)
  //now to fetch inventory from firebase,..

  //to update it from firebase, we need to make it async so that it wont be blocked when we r fetching from firebase n it will not freeze the website
  
  const updateInventory = async () =>{
     const snapshot = query(collection(firestore, 'inventory'))
     const docs = await getDocs(snapshot)
     const inventoryList = []
     docs.forEach((doc) => {
      //add it to inventory list
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
      
     })
     setInventory(inventoryList)
     console.log(inventoryList)
  } 

  const addItem = async (item) =>{
    if (!item) {
      alert("item is empty or undefined")
      return;
    }
    const docRef= doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
  
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
      
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }
  await updateInventory()
  
   }



 const removeItem = async (item) =>{
  const docRef= doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)

  if(docSnap.exists()){
    const {quantity} = docSnap.data()
    if(quantity==1){
      await deleteDoc(docRef)
    }
    else{
      await setDoc(docRef, {quantity: quantity-1})
    }
  }
await updateInventory()

 }
  useEffect(() =>{

    updateInventory()

  }, []) //[] -which is a  dependency array, which is none here so runs only once in the beginning when page loads. 
  //so we r updating when page loads.


//adding models
const handleOpen = () => setOpen(true)
const handleClose =() => setOpen(false)
  return (
    
  <Box width="100vw" height="100vh" display="flex" flexDirection="column"justifyContent="center" alignItems="center" gap={2}>
    <Typography variant="h4">
      Pantry Management App
    </Typography>
    <Modal
    open={open}
    onClose={handleClose}>
      <Box
      position="absolute"
      top="50%"
      left="50%"
      
      sx={{
          transform:"translate(-50%, -50%)"
      }}
      width={400}
      bgcolor={"white"}
      border="2px solid #000 "
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}> 
      <Typography variant="h6">Add Item</Typography>
      <Stack width="100%" direction="row" spacing={2}>
      <TextField 
      variant="outlined"
      fullWidth
      value={itemName}
      onChange={(e) =>{
        setItemName(e.target.value)
      }}/>
      <Button variant="outlined" onClick={() => {
        addItem(itemName)
        setItemName('')
        handleClose()
      }}>ADD</Button>
      </Stack>
      </Box>
    </Modal>
    <Typography variant="h5">
    
    </Typography>
    <Button variant="contained" 
    onClick={() =>{
      handleOpen()
    }}>Add new item
    </Button>
    <Box border="1px solid #333">
      <Box width="800px"
      height="100px"
      bgcolor="#ADD8E6"
      display="flex"
      alignItems="center"
      justifyContent="center">
        <Typography variant="h4" color="#333">
          Inventory items
        </Typography>
      </Box>
  
    <Stack width="800px" height="600px" spacing={3} overflow="auto">
      {
        inventory.map(({name, quantity}) => (
          <Box key={name} width="100%" height="60px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={5}>
            <Typography variant="h6" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => {
              addItem(name)
            }}>
              ADD
            </Button>
            <Button variant="contained" onClick={() => {
              removeItem(name)
            }}>
              REMOVE
            </Button>
            </Stack>
          </Box>

        ))
      }
    </Stack>
    </Box>
  </Box>
 
  );
}
/*
<Box>
    <Typography variant="h1">
      Inventory Management
    </Typography>
    {
      inventory.forEach((item) =>{
        console.log(item)
        return (<Box>
        {item.name},
        {item.count}
        </Box>)
      })
    }
  </Box>*/
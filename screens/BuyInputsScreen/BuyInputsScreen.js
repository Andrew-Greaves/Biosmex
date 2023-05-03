import React, { useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,Image,ScrollView,TouchableOpacity,StatusBar,FlatList,Modal } from 'react-native';
import { Text,Input,Icon,Button,SearchBar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import axios from 'axios';
import base64 from 'react-native-base64';
import CartModal from '../../components/Modal/CartModal';


 //Product Categories
 const categories = [  
      {    
        name: 'Integrated Packet',    
        subcategories: []
    },
    {
      name: 'Crop Protection',
      subcategories: [
        {
          name: 'Adjuvants',
          subcategories: []
        },
        {
          name: 'Insumos',
          subcategories: [
            {
              name: 'Insumos biológicos',
              subcategories: [
                {
                  name: 'Herbicidas',
                  subcategories: []
                },
                {
                  name: 'Insecticidas',
                  subcategories: []
                },
                {
                  name: 'Fungicidas',
                  subcategories: []
                },
              ]
            },
            {
              name: 'Insumos químicos',
              subcategories: [
                {
                  name: 'Herbicidas',
                  subcategories: []
                },
                {
                  name: 'Insecticidas',
                  subcategories: []
                },
                {
                  name: 'Fungicidas',
                  subcategories: []
                },
              ]
            },
          {
            name: 'Bioestimulantes',
            subcategories: []
          }
        ]
      },
    ],
  },
  {
    name: 'Crop Nutrition',
    subcategories: [
      {
        name: 'Advanced Micronutrients',
        subcategories: []
      },
      {
        name: 'Inoculants',
        subcategories: []
      },
      {
        name: 'Soil Prebiotics',
        subcategories: []
      },
      {
        name: 'Fertilizante orgánico',
        subcategories: [
          {
            name: 'Composta A',
            subcategories: []
          },
          {
            name: 'Composta B',
            subcategories: []
          }
        ]
      },
      {
        name: 'Fertilizante quimico',
        subcategories: []
      }
    ],
  },
  {
    name: 'Semillas',
    subcategories: [
      {
        name: 'Semillas Híbridas',
        subcategories: []
      },
      {
        name: 'Semillas tradicionales',
        subcategories: []
      },
      {
        name: 'Semillas OGM',
        subcategories: []
      }
    ],
  }
];
  

const BuyInputsScreen = () => {
  //Connect to Odoo Database
  const baseUrl = 'http://biosmex.odoo.com:80';
  const db = 'biosmex-biosmex-production-7962955';
  const username = 'admin';
  const password = 'Nio@1234';

  const endpoint = `${baseUrl}/web/dataset/search_read`;
  const loginEndpoint = `${baseUrl}/web/session/authenticate`;

  const getSessionId = async () => {
      try {
        const auth = base64.encode(`${username}:${password}`);
        const response = await axios.post(
          loginEndpoint,
          {
            jsonrpc: '2.0',
            method: 'call',
            id: Math.floor(Math.random() * 100000000) + 1,
            params: {
              db,
              login: username,
              password,
            },
          },
          {
            baseURL: baseUrl,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${auth}`,
            },
          },
        );
        return response.data.result.session_id;
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    

  const searchParams = {
      model: 'product.template',
      fields: ['name', 'list_price','categ_id','image_128','description_sale'],
  };

  const fetchData = async () => {
      try {
        const auth = base64.encode(`${username}:${password}`);
        const sessionId = await getSessionId();
        const response = await axios.post(
          endpoint,
          {
            jsonrpc: '2.0',
            method: 'call',
            id: Math.floor(Math.random() * 100000000) + 1,
            params: {
              model: searchParams.model,
              fields: searchParams.fields,
              domain: [],
              context: { session_id: sessionId },
              offset: 0,
              limit: false,
              sort: '',
            },
          },
          {
            baseURL: baseUrl,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${auth}`,
            },
          },
        );
        setProducts(response.data.result.records.map(record => ({
          ...record,
          image_128: `data:image/png;base64,${record.image_128}`, // add prefix to base64 string
          list_price: Number(record.list_price).toFixed(2), // format list_price to two decimal places
        })));
      } catch (error) {
        console.error(error);
      }
    };
  

  useEffect(() => {
    fetchData();
  }, []);

  //State Variables
  const [modalVisible, setModalVisible] = useState(false);
  const [cartmodalVisible, setCartModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products,setProducts]=useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantity,setQuantity]=useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // const [selectedCategorys, setSelectedCategorys] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  const navigation = useNavigation();

  const CategoryButton = ({ category, onPress }) => {
    return (
    <View style={{alignItems:"center",justifyContent:"center"}}>
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.categoryButton}>{category.name}</Text>
        </TouchableOpacity>
    </View>
    );
  };
    
  const SubcategoryButton = ({ subcategory, onPress }) => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => onPress(subcategory)}>
          <Text style={styles.categoryButton}>{subcategory.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Add parent reference to each subcategory
  const addParentRefs = (categories, parent = null) => {
    return categories.map(category => {
      const newCategory = { ...category, parent };
      if (category.subcategories) {
        newCategory.subcategories = addParentRefs(category.subcategories, newCategory);
      } else {
        newCategory.subcategories = [];
      }
      return newCategory;
    });
  };

  // Call addParentRefs on categories
  const categoriesWithParentRefs = addParentRefs(categories);

  const handleSubcategoryPress = (subcategory) => {
    if(subcategory.subcategories && subcategory.subcategories.length > 0){
      setSelectedCategory(subcategory);
      setShowSubcategories(true);
    } else {
      // Construct the category path and filter products
      const categoryPath = constructCategoryPath(subcategory);
      console.log(categoryPath);
      handleCategoryFilter(categoryPath);
    }
  };

    // Function to construct the category path
    const constructCategoryPath = (subcategory) => {
      let path = subcategory.name;
      let current = subcategory;
      
      // Traverse up to the root category
      while (current.parent) {
        // If the parent is the root and not "Seeds", break the loop
        if (!current.parent.parent && current.parent.name !== "Semillas") break;
    
        path = `${current.parent.name} / ${path}`;
        current = current.parent;
      }
    
      return path;
    };

    const handleCategoryPress = (category) => {
      setSelectedCategory(category);
      setShowSubcategories(true);
    };

    const handleBackPress = () => {
      setSelectedCategory('all');
      setShowSubcategories(false);
      handleCategoryFilter('all');
    };

     //FILTER BY CATEGORY
     const handleCategoryFilter = (category) => {
      setSelectedCategory(category);
      let filtered;
      if (Array.isArray(products)) {
        filtered = products.filter((product) => category === 'all' || product.categ_id[1] === category);
      }
      console.log(filtered);
      if (filtered !== undefined) {
        setFilteredProducts(filtered);
      }
    };

    // FILTER BY SEARCH
   const [searchQuery, setSearchQuery] = useState('');
   

   useEffect(() => {
     const filtered = products.filter(
       (product) =>
         (selectedCategory === 'all' || product.categ_id[1] === selectedCategory) &&
         product.name.toLowerCase().includes(searchQuery.toLowerCase())
     );
     setFilteredProducts(filtered);
   }, [searchQuery, selectedCategory, products]);
   
   const handleSearch = (query) => {
     setSearchQuery(query);
   };
    
   const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
};

const addToCart = (product, quantity) => {
  const existingItem = cartItems.find(item => item.product.id === product.id);

  if (existingItem) {
    // If the item is already in the cart, update the quantity
    const updatedItem = { product, quantity: existingItem.quantity + quantity };
    const updatedCartItems = cartItems.map(item => item.product.id === product.id ? updatedItem : item);
    setCartItems(updatedCartItems);
  } else {
    // If the item is not in the cart, add it
    const newItem = { product, quantity };
    const updatedCartItems = [...cartItems, newItem];
    setCartItems(updatedCartItems);
  }
};

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updatedCartItems);
  };


    return(
        <View style={styles.view}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View style={{flexDirection:"row", width:"100%",justifyContent:"space-between",padding:16}}>
                    <TouchableOpacity onPress={() => setCartModalVisible(true)}>
                        <Icon type= 'material-community' size={20} name= 'cart' containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3"}}/>
                    </TouchableOpacity>
                     {/* Render the CartModal component */}
                    <CartModal cartItems={cartItems} removeFromCart={removeFromCart} modalVisible={cartmodalVisible} setModalVisible={setCartModalVisible} />
                    {/* Home Button */}
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Icon type= 'material-community' size={20} name= 'home' containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3"}}/>
                    </TouchableOpacity>
                    <Header />
                </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* VIEW FOR SEARCHBAR  */}
                <View style={{alignItems:"center",}}>
                    <SearchBar lightTheme={true} placeholder="Search Products..." onChangeText={handleSearch} value={searchQuery} 
                    containerStyle={{width:'90%',marginTop:20}}/>
                </View>
                <View style={{padding:16}}>
                  {/* Text displaying the category section title */}
                    <Text style={{fontSize:18,fontWeight:500,letterSpacing:1, marginTop:20}}>Shop by Category</Text>
                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingTop:20,flexWrap:"wrap",}}>
                    {/* if showSubcategories is true, display subcategories */}
                        {showSubcategories ? ( 
                        <>
                          <View style={{alignItems:"center",justifyContent:"center"}}>
                            {/* Button to go back to parent category */}
                            <TouchableOpacity onPress={handleBackPress}>
                              <Text style={styles.categoryButton}>Back</Text>
                            </TouchableOpacity>
                          </View>
                            {/* Display subcategory buttons */}
                          {selectedCategory.subcategories.map((subcategory) => (
                            <SubcategoryButton 
                              key={subcategory.name} 
                              subcategory={subcategory} 
                              onPress={() => handleSubcategoryPress(subcategory)} // added onPress prop
                            />
                          ))}
                        </>
                      ) : (
                        // Display category buttons
                        <>
                          {categoriesWithParentRefs.map((category) => (
                            <CategoryButton
                              key={category.name}
                              category={category}
                              onPress={() => handleCategoryPress(category)}
                            />
                          ))}
                        </>
                      )}
                    </View>
                    
                </View>
                <View style={{flexDirection:"row", marginTop:20,alignItems:"center",justifyContent:"space-between",padding:16}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:18,fontWeight:500,letterSpacing:1}}>Products</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleCategoryFilter("all")}>
                        <Text style={{fontSize:14,color:"blue",fontWeight:400}}>See All</Text>
                    </TouchableOpacity>
                </View>
                
                {/* // Wrap product items in an outer View */}
              <View style={styles.productList}>
                {/* Modal for item details */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      {selectedProduct && (
                        <>
                          <Image source={{ uri: selectedProduct.image_128 }} style={{ width: 100, height: 100, marginBottom:20 }} />
                          <Text style={styles.modalText}>{selectedProduct.name}</Text>
                          <Text style={styles.modalText}>{selectedProduct.description_sale}</Text>
                          <Text style={styles.modalText}>Price: ${selectedProduct.list_price}</Text>
                          <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={() => setQuantity(quantity - 1)}>
                            <Icon type= 'material-community' size={15} name= 'minus' containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3"}}/>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                            <Icon type= 'material-community' size={15} name= 'plus' containerStyle={{borderWidth:1,borderRadius:10,padding:12,backgroundColor:"#D3D3D3"}}/>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{ ...styles.addButton }}
                            onPress={() => {
                              addToCart(selectedProduct, quantity);
                              setModalVisible(!modalVisible);
                            }}
                          >
                            <Text style={styles.textStyle}>Add to Cart (${selectedProduct.list_price * quantity})</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ ...styles.openButton }}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                            }}
                          >
                            <Text style={styles.textStyle}>Close</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </Modal>
                {
                  filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => (
                    // Use modulus to find every second product
                    // Then, pair it with the previous product and wrap them in a View
                    index % 2 === 0 ? (
                      <View style={styles.productRow} key={product.id}>
                        <View style={styles.productItem} key={product.id}>
                          <TouchableOpacity onPress={() => handleProductPress(product)}>
                            <Image source={{ uri: product.image_128 }} style={{ width: 100, height: 100 }} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleProductPress(product)}>
                            <Text style={styles.productName}>{product.name}</Text>
                          </TouchableOpacity>
                          <Text style={styles.price}>${product.list_price}</Text>
                          <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product,1)}>
                            <Text style={{ color: '#fff' }}>Add to cart</Text>
                          </TouchableOpacity>
                        </View>
                        {
                          // Check if there's a next product to pair with the current one
                          filteredProducts[index + 1] ? (
                            <View style={styles.productItem} key={filteredProducts[index + 1].id}>
                              <TouchableOpacity onPress={() => handleProductPress(filteredProducts[index + 1])}>
                                <Image source={{ uri: filteredProducts[index + 1].image_128 }} style={{ width: 100, height: 100 }} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => handleProductPress(filteredProducts[index + 1])}>
                                <Text style={styles.productName}>{filteredProducts[index + 1].name}</Text>
                              </TouchableOpacity>
                              <Text style={styles.price}>${filteredProducts[index + 1].list_price}</Text>
                              <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(filteredProducts[index + 1],1)}>
                                <Text style={{ color: '#fff' }}>Add to cart</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null
                        }
                      </View>
                    ) : null
                  ))
                }
              </View>
            </ScrollView>     
        </View>
        
)};

const styles=StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop:50,
    paddingLeft:10
  },
  button: {
    width: "75%",
    height:50,
    marginTop: 10
  },
  Icon: {
    marginTop: 75
  },
 
  categoryButton:{
    marginBottom:10,
    width:170,
    height:40,
    borderWidth:2,
    borderRadius:10,
    borderColor:"#46D17E",
    fontWeight:600,
    textAlign: 'center',
    paddingTop:5,
    
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#666',
    
  },
  productList: {
    flex: 1,
    flexDirection: 'column',
  },
  productRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    height:270
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:250
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight:"bold"
  },
  quantityControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    paddingLeft:15,
    paddingRight:15
  },
  addButton: {
    backgroundColor: "#46D17E",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
    width:250
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
    backgroundColor: '#46D17E',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10
  },

})

export default BuyInputsScreen;
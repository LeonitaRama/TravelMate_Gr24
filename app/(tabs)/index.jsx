import React, { useState, useRef, useContext } from 'react';
import { ImageBackground } from 'react-native';
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext.jsx";
import { lightTheme, darkTheme } from "../../context/ThemeStyles.jsx";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  Modal,
  ScrollView as RNScrollView
} from 'react-native';
import WhyChooseUs from "../(components)/WhyChooseUs.jsx";
import { useTranslation } from 'react-i18next';



const { width } = Dimensions.get ('window');

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
    const languages = ["English", "Albanian"];
  
  

  const destinations = [
    { id: '1', name: 'Paris', img: require('../../assets/Paris.jpg'), category: 'City', description: 'City of Lights, famous for the Eiffel Tower, cafes, and art museums.', rating: 4.8 },
    { id: '2', name: 'Tokyo', img: require('../../assets/tokyo.jpg'), category: 'City', description: 'Vibrant city blending tradition and technology, famous for sushi and temples.', rating: 4.7 },
    { id: '3', name: 'New York', img: require('../../assets/NYC.jpg'), category: 'City', description: 'The Big Apple, known for Times Square, Broadway, and iconic skyline.', rating: 4.9 },
    { id: '4', name: 'Bali', img: require('../../assets/bali.jpg'), category: 'Beach', description: 'Tropical paradise with sandy beaches, lush jungles, and vibrant culture.', rating: 4.8 },
    { id: '5', name: 'Sydney', img: require('../../assets/sydney.jpg'), category: 'City', description: 'Iconic harbor city with stunning beaches and the famous Sydney Opera House.', rating: 4.7 },
    { id: '6', name: 'Maldives', img: require('../../assets/Maldives.jpg'), category: 'Beach', description: 'Crystal clear waters, white sand beaches, and luxurious resorts.', rating: 4.9 },
    { id: '7', name: 'Nepal', img: require('../../assets/Nepal.jpg'), category: 'Adventure', description: 'Mountain trekking, Himalayan views, and thrilling adventure activities.', rating: 4.9 },
    { id: '8', name: 'Amazon Rainforest', img: require('../../assets/AmazonRainforest.jpg'), category: 'Adventure', description: 'Explore the largest rainforest in the world, wildlife, and river cruises.', rating: 4.8 },
    { id: '9', name: 'Iceland', img: require('../../assets/iceland.jpg'), category: 'Adventure', description: 'Glaciers, volcanoes, geysers, and northern lights experiences.', rating: 4.9 },
    { id: '10', name: 'Rome', img: require('../../assets/rome.jpg'), category: 'City', description: 'Ancient city with Colosseum, Vatican, and rich cultural heritage.', rating: 4.8 },
  ];

  const categories = [
    { id: 'c1', name: 'Beach', emoji: '🌴', color: '#f59e0b' },
    { id: 'c2', name: 'Adventure', emoji: '🌄', color: '#10b981' },
    { id: 'c3', name: 'City', emoji: '🏙️', color: '#3b82f6' },
  ];

  const photos = [
    require('../../assets/gallery-1.jpg'),
    require('../../assets/gallery-2.jpg'),
    require('../../assets/gallery-3.jpg'),
    require('../../assets/gallery-4.jpg'),
    require('../../assets/gallery-5.jpg'),
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchCategory = selectedCategory ? dest.category === selectedCategory : true;
    const matchQuery = dest.name.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };
const modalFadeAnim = useRef(new Animated.Value(0)).current;
const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

const [modalVisible, setModalVisible] = useState(false);
const [selectedDestination, setSelectedDestination] = useState(null);


 const handleSeeMore = (destination) => {
  setSelectedDestination(destination);
  setModalVisible(true);

  Animated.parallel([
    Animated.timing(modalFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.spring(modalScaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }),
    Animated.timing(modalTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();
};

const closeModal = () => {
  Animated.parallel([
    Animated.timing(modalFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(modalScaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(modalTranslateY, {
      toValue: 40,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start(() => setModalVisible(false));
};

  const renderCarouselItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width * 0.7,
      index * width * 0.7,
      (index + 1) * width * 0.7,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image 
          source={typeof item.img === 'string' ? { uri: item.img } : item.img} 
          style={styles.cardImage} 
        />
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={styles.categoryLabel}>{item.category}</Text>
        <Text style={styles.rating}>
          {'★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating))}
        </Text>
       <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => handleSeeMore(item)}
      style={[
      styles.seeMoreBtn,
      { backgroundColor: theme.button },
]}
>
  <Text style={[styles.seeMoreText, { color: theme.buttonText }]}>
    {t("home.seeMore")}
  </Text>
</TouchableOpacity>

      </Animated.View>
    );
  };
  

  return (
 <ScrollView contentContainerStyle={styles.scrollContent}
     style={{ backgroundColor: theme.background }}
     >
<Modal
  transparent
  visible={modalVisible}
  animationType="none"
  onRequestClose={closeModal}
>

  <View style={styles.modalOverlay}>
   <Animated.View
  style={[
    styles.modalContent,
    {
      backgroundColor: theme.card,
      opacity: modalFadeAnim,
      transform: [
        { scale: modalScaleAnim },
        { translateY: modalTranslateY },
      ],
    },
  ]}
>

      {selectedDestination && (
        <>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {selectedDestination.name}
          </Text>

          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
            {selectedDestination.description}
          </Text>

          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
            {t("category")}: {selectedDestination.category}
          </Text>

          <Text style={styles.rating}>
            Rating: {selectedDestination.rating} ★
          </Text>

          <TouchableOpacity
            onPress={closeModal}
            style={[styles.closeBtn, { backgroundColor: theme.button }]}
          >
            <Text style={{ color: theme.buttonText, fontWeight: '600' }}>
              Close
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  </View>
</Modal>

      <ImageBackground
        source={require('../../assets/egypt.jpg')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
       <View
        style={[
          styles.overlay,
          {
            backgroundColor: darkMode
              ? "rgba(0,0,0,0.4)" 
              : "rgba(255,255,255,0.2)",
          },
        ]}
      />
        <Text style={styles.title}>
     {t('home.welcome')}
  </Text>

  <Text style={styles.subtitle}>
     {t('home.subtitle')}
  </Text>

  <TextInput
    style={[
      styles.search,
      {
        backgroundColor: theme.inputBackground,
        color: theme.text,
        borderColor: theme.border,
      },
    ]}
    placeholder={t('home.search.placeholder')}
    placeholderTextColor={theme.placeholder}
    value={query}
    onChangeText={setQuery}
  />
</ImageBackground>

      <View style={styles.contentSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.categories')}</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                { backgroundColor: item.name === selectedCategory ? theme.accent : theme.card, borderWidth:1, borderColor:theme.border,},
              ]}
              onPress={() => handleCategoryPress(item.name)}
            >
              <Text style={[styles.categoryText,{ color: theme.text }]}>{item.emoji} {item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={[styles.sectionTitle, {color:theme.text}]}>{t('home.popularDestinations')}</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 16, textAlign: 'left' }}>
          {t('home.popularDescription')}
        </Text>

        <Animated.FlatList
          data={filteredDestinations}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={width * 0.7}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width * 0.7,
            index * width * 0.7,
            (index + 1) * width * 0.7,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });
          
          return (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [{ scale }],
                  backgroundColor: theme.card,
                },
              ]}
            >
              <Image source={item.img} style={styles.cardImage} />

              <Text style={[styles.cardText, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
                {item.category}
              </Text>

              <Text style={styles.rating}>
                {"★".repeat(Math.floor(item.rating)) +
                  "☆".repeat(5 - Math.floor(item.rating))}
              </Text>

              <TouchableOpacity style={[styles.seeMoreBtn, {backgroundColor:theme.button}]} onPress={() => handleSeeMore(item)}>
                <Text style={[styles.seeMoreText, {color:theme.buttonText}]}>{t('home.seeMore')}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />


        <Text style={[styles.sectionTitle, {color: theme.text}]}>{t('home.photoGallery')}</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 16, textAlign: 'left' }}>
           {t('home.photoDescription')}
        </Text>

        <View style={[styles.photoCard, { maxHeight: 500 , backgroundColor: theme.card,}]}>
        <ScrollView 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
      {photos.map((photo, index) => (
      <Image 
        key={index} 
        source={photo} 
        style={[styles.photo, { marginBottom: 10 }]} 
        resizeMode="cover"
      />
      
    ))}
    
  </ScrollView>
</View>  
<WhyChooseUs />
</View> 
  <View style={[styles.textCard, { backgroundColor: theme.card }]}>
  <Text style={[styles.textCardTitle, { color: theme.text }]}>{t('home.callToAction.title')}</Text>
  <Text style={[styles.textCardContent, { color: theme.text}]}>{t('home.callToAction.text')}</Text>
  <ScrollView style={{ maxHeight: 150 }}>
    <Text style={[styles.textCardContent ,{color: theme.textSecondary}]}>
 {t('home.callToAction.description')}
    </Text>
  </ScrollView>
</View>

<View style={[styles.infoCard, { backgroundColor: theme.card }]}>
  <Text style={[styles.infoCardTitle, { color: theme.text }]}>{t('home.about.title')}</Text>
  <ScrollView style={{ maxHeight: 120 }}>
    <Text style={[styles.infoCardContent,{ color: theme.textSecondary }]}>
       {t('home.about.content')}
    </Text>
  </ScrollView>
  

  <View style={styles.contactSection}>
    <Text style={[styles.infoCardTitle,{color: theme.text}]}>{t('home.contactUs.title')}</Text>
    <Text style={[styles.infoCardContent, {color: theme.text}]}>{t('home.contactUs.subtitle')}</Text>
    <Text style={[styles.contactItem,{ color: theme.text }]}>📞  +01 (123) 4567 90</Text>
    <Text style={[styles.contactItem, { color: theme.text }]}>✉️  info.TravelMate.com</Text>
    <Text style={[styles.contactItem,{ color: theme.text }]}>📍  Rruga “Agim Ramadani”, Prishtinë, Kosovë</Text>
  </View>
</View>
<View style={[styles.footer,{ backgroundColor: theme.footer, borderTopColor:theme.footer,}]}>
  <Text style={[styles.footerText,{ color: theme.textSecondary }]}> {t('home.footer')}</Text>
  <View style={[styles.footerLinks,{ color: theme.text }]}>
    <Text style={styles.link}>{t('home.footer.privacy')}</Text>
    <Text style={styles.separator}> | </Text>
    <Text style={styles.link}>{t('home.footer.terms')}</Text>
    <Text style={styles.separator}> | </Text>
    <Text style={styles.link}>{t('home.footer.faq')}</Text>
  </View>
</View>

    </ScrollView>
 
    
  );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16 
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    padding: 15,                     
    borderWidth: 1,                
    borderRadius: 12, 
    color:"#fff",
    borderColor:"#fff",
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color:"#fff"
  },
  search: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginVertical: 10,
    color:'#4b4a4aff',
  },
  categoryCard: { 
    padding: 15, 
    borderRadius: 10, 
    marginRight: 10 
  },
  categoryText: { 
  
    fontWeight: '600' 
  },
  card: { 
    marginRight: 10, 
    borderRadius: 10, 
    overflow: 'hidden',
    width: width * 0.7, 
    alignItems: 'center', 
    paddingBottom: 10 
  },
  cardImage: { 
    width: '100%', 
    height: 140 
  },
  cardText: { 
    paddingTop: 8, 
    fontWeight: '600', 
    fontSize: 16 
  },
  categoryLabel: { 
    fontSize: 12, 
    marginBottom: 5 
  },
  rating: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#f59e0b', 
    marginBottom: 5 
  },
  seeMoreBtn: { 
  marginTop: 3,
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: 'center',
  },
  seeMoreText: { 
    fontWeight: '600', 
    textAlign: 'center',
    padding: 8, 
    color: '#fff',  
    borderRadius: 5,
  
  },
  photoCard: {
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 photo: {
  width: '100%',
  height: 200, 
  borderRadius: 10,
},
textCard: {
  backgroundColor: '#2a8fdbff',
  borderRadius: 0,
  padding: 16,
  marginVertical: 0,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

textCardTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 8,
},

textCardContent: {
  fontSize: 16,
  lineHeight: 22,
},
infoCard: {
  borderRadius: 0,
  padding: 15,
  marginVertical: 0,
},

infoCardTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#3b4b58',
  paddingBottom: 5,
},

infoCardContent: {
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 10,
},

contactSection: {
  marginTop: 15,
},

contactItem: {
  fontSize: 14,
  marginVertical: 3,
},
footer: {
  paddingVertical: 15,
  paddingHorizontal: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopWidth: 1,
  marginTop: 0,
  backgroundColor: '#747373ff'
},
footerText: {
  fontSize: 12,
},
footerLinks: {
  flexDirection: 'row',
  alignItems: 'center',
},
link: {
  fontSize: 12,
},
separator: {
  marginHorizontal: 5,
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  width: '85%',
  borderRadius: 15,
  padding: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalText: {
  fontSize: 14,
  marginBottom: 6,
},
closeBtn: {
  marginTop: 15,
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
},


});

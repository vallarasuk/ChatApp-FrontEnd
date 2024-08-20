import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const CategorySelectionScreen = ({ navigation, route }) => {
  const [categories, setCategories] = useState([]);
  const [ageCategories, setAgeCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [selectedAgeCategoryId, setSelectedAgeCategoryId] = useState(null); // Single select
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  useEffect(() => {
    const fetchCategoriesAndAgeCategories = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}api/categories`
        );
        const categoriesData = categoriesResponse.data.map((category) => ({
          id: category.object_id,
          name: category.object_name,
        }));

        // Fetch age categories
        const ageCategoriesResponse = await axios.get(
          `${REACT_APP_BACKEND_URL}api/age-categories`
        );
        const ageCategoriesData = ageCategoriesResponse.data.map(
          (ageCategory) => ({
            id: ageCategory.object_id,
            name: ageCategory.object_name,
          })
        );

        // Set state
        setCategories(categoriesData.filter((category) => category.id != null));
        setAgeCategories(
          ageCategoriesData.filter((ageCategory) => ageCategory.id != null)
        );
      } catch (error) {
        console.error("Error fetching categories or age categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndAgeCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategoryIds((prevSelectedCategoryIds) => {
      const updatedCategoryIds = new Set(prevSelectedCategoryIds);

      if (updatedCategoryIds.has(category.id)) {
        updatedCategoryIds.delete(category.id);
      } else {
        updatedCategoryIds.add(category.id);
      }

      return updatedCategoryIds;
    });
  };

  const handleAgeCategorySelect = (ageCategory) => {
    setSelectedAgeCategoryId((prevSelectedAgeCategoryId) => {
      if (prevSelectedAgeCategoryId === ageCategory.id) {
        return null; // Deselect if already selected
      } else {
        return ageCategory.id; // Select new age category
      }
    });
  };

  const handleContinue = async () => {
    if (
      selectedCategoryIds.size === 0 ||
      selectedAgeCategoryId === null ||
      !userId
    ) {
      console.log("No categories or age categories selected or userId missing");
      return;
    }

    try {
      await axios.put(`${REACT_APP_BACKEND_URL}api/users/${userId}/category`, {
        categories: Array.from(selectedCategoryIds),
        ageCategory: selectedAgeCategoryId,
      });
      navigation.navigate("NextScreen");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleSkip = () => {
    navigation.navigate("NextScreen");
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategoryIds.has(item.id) && styles.selectedCategoryCard,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategoryIds.has(item.id) && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderAgeCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedAgeCategoryId === item.id && styles.selectedCategoryCard,
      ]}
      onPress={() => handleAgeCategorySelect(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedAgeCategoryId === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00796b" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Select Your Categories</Text> */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.categoryList}
        ListHeaderComponent={<Text style={styles.subTitle}>Categories</Text>}
      />
      <FlatList
        data={ageCategories}
        renderItem={renderAgeCategoryItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.categoryList}
        ListHeaderComponent={
          <Text style={styles.subTitle}>Age Categories</Text>
        }
      />
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleContinue} style={styles.button}>
          Continue
        </Button>
        <Button mode="outlined" onPress={handleSkip} style={styles.button}>
          Skip
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#555",
  },
  categoryList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 15,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  selectedCategoryCard: {
    backgroundColor: "#00796b", // Highlight color for selected categories
  },
  categoryText: {
    fontSize: 18,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff", // Change text color for selected categories
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "#00796b",
    textAlign: "center",
    marginTop: 10,
  },
});

export default CategorySelectionScreen;

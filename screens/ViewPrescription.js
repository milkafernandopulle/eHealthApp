// ViewPrescription.js
import React, { useEffect, useState,useRef  } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import RenderHtml from "react-native-render-html";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import PrimaryButton from "../components/PrimaryButton";
import Loading from "../components/Loading";
const ViewPrescription = ({ route }) => {
  const { prescriptionId } = route.params;
  const navigation = useNavigation();
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const richText = useRef();

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      setIsLoading(true)
      const docRef = doc(firestore, "prescriptions", prescriptionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrescriptionData(docSnap.data());
        setIsLoading(false)
      } else {
        console.log("No such prescription!");
        setIsLoading(false)
      }
    };
    fetchPrescriptionData();
  }, [prescriptionId]);

  const source = {
    html: prescriptionData?.prescription || "",
  };

  console.log("The Prescription data got from DB is",prescriptionData);


  const handleEdit = () => {
    setIsEditing(true);
    // if (richText.current && prescriptionData?.prescription) {
    //   richText.current.setContentHTML(prescriptionData.prescription);
    // }
  };
  
  const handleSave = async () => {
    let html = await richText.current?.getContentHtml();
    try {
      await updateDoc(doc(firestore, "prescriptions", prescriptionId), {
        prescription: html,
      });
      alert("Prescription updated successfully!");
      setPrescriptionData({ ...prescriptionData, prescription: html });
      setIsEditing(false);
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Failed to update the prescription.");
    }
  };


  const handleDelete = async () => {
    try {
      // Delete the prescription from Firestore
      await deleteDoc(doc(firestore, "prescriptions", prescriptionId));
      alert("Prescription deleted successfully!");
      navigation.goBack(); // Or navigate to another screen as needed
    } catch (error) {
      console.error("Error deleting prescription: ", error);
      alert("Failed to delete the prescription.");
    }
  };

  if(isLoading){
    return <Loading />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    {prescriptionData && !isEditing ? (
      <View style={styles.prescriptionContainer}>
        <RenderHtml contentWidth={50} source={{ html: prescriptionData.prescription }} />
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            <MaterialIcons name="edit" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <MaterialIcons name="delete" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    ) :  isEditing && prescriptionData ? (
      <>
        <RichEditor
        key={`rich-editor-${prescriptionId}`} 
          ref={richText}
          style={styles.richEditor}
          initialContentHTML={prescriptionData.prescription}
          androidLayerType="software"
        />
        <RichToolbar
          style={styles.richBar}
          editor={richText}
        />
        <PrimaryButton onPress={handleSave} buttonText="Save Changes" />
      </>
    ) : (
      <View style={styles.message}>
        <Text>No Prescription found!</Text>
      </View>
    )}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:70
  },
  prescriptionContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 15,
    borderRadius: 8,
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  },
  richEditor: {
    minHeight: 250,
    borderColor: "lightgrey",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  richBar: {
    borderColor: "lightgrey",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default ViewPrescription;

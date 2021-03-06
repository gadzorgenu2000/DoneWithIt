import React,{useState} from 'react';
import { StyleSheet } from 'react-native'
import * as Yup from 'yup'

import{
    AppForm,
    AppFormField,
    AppFormPicker,
    SubmitButton
} from '../components/Forms'
import CategoryPickerItem from '../components/CategoryPickerItem';
import Screen from '../components/Screen';
import FormImagePicker from '../components/Forms/FormImagePicker';
import useLocation from '../hooks/useLocation';
import listingsApi from '../api/listings'
import UploadScreen from './UploadScreen';
// import UploadScreen from './UploadScreen';


const  validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label('Title'),
    price: Yup.number().required().min(1).max(10000).label('Price'),
    description: Yup.string().label('Description'),
    category: Yup.object().required().nullable().label('Category'),
    images: Yup.array().min(1,'Select at least one image.')
    // images: Yup.array().min(1,'Select at least one image.').of(Yup.object().shape({
    //     url: Yup.string().label('Image url is required')
    // }))
})

const categories=[
    { label: 'Furniture',value: 1, backgroundColor:'red', icon:'floor-lamp' },
    { label: 'Cars',value: 2, backgroundColor:'orange',icon:'car'},
    { label: 'Camera',value: 3, backgroundColor:'yellow', icon:'camera'},
    { label: 'Games',value:4,backgroundColor:'pink', icon:'cards'},
    { label: 'Clothing',value:5,backgroundColor:'green', icon:'shoe-heel'},
    { label: 'Sports',value:6,backgroundColor:'blue', icon:'basketball'},
    { label: 'Movies & Music',value:7,backgroundColor:'blue', icon:'headphones'},
    { label: 'Books',value:8,backgroundColor:'violet', icon:'book-open-variant'},
    { label: 'Others',value:9,backgroundColor:'gray', icon:'application'}
  ]

function ListingEditScreen () {

const location = useLocation()

const [uploadVisible, setUploadVisible] = useState(false)
const [progress, setProgress] = useState(0)

const initialValues = {
    title: '',
    price: '',
    description: '',
    category: null,
    images:[]
}

const onSubmit = async (values, { resetForm}) => {
    setProgress(0)
    setUploadVisible(true)

    const result = await listingsApi.addListing(
        { ...values, location},
        progress => setProgress(progress)
        )
    setUploadVisible(false)
    
    if(!result.ok){
        setUploadVisible(false)
     return alert('Could not save the listing.')
    }
    resetForm()
}
 
    return (
       <Screen style={styles.container} >
           <UploadScreen
                onDone={()=> setUploadVisible(false)}
                progress={progress}
                visible={uploadVisible}
           />
           <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
           >
               <FormImagePicker
                    name='images'
               />
               <AppFormField 
                    maxLength={255}  
                    name='title' 
                    placeholder='Title'
                />
                <AppFormField
                    keyboardType='numeric'
                    maxLength={8}
                    name='price'
                    placeholder='Price'
                    width={120}
                />
                <AppFormPicker
                    items={categories}
                    name='category'
                    numberOfColumns={3}
                    PickerItemComponent={CategoryPickerItem}
                    placeholder='Category'
                    width='50%'
                />
                <AppFormField
                    maxLength={255}
                    multiline
                    name='description'
                    numberOfLines={3}
                    placeholder='Description'
                    />
                <SubmitButton title='Post' />         
          </AppForm>
       </Screen>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 10
    }
})
export default ListingEditScreen;
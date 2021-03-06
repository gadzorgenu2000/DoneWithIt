import client from './client'

// const { add } = require("react-native-reanimated")

// const endpoint = '/listings'

const getListings = () => client.get('/listings')

const addListing = (listing, onUploadProgress) => {
    const data = new FormData()
    data.append('title',listing.title)
    data.append('price',listing.price)
    data.append('categoryId',listing.category.value)
    data.append('description',listing.description)

    listing.images.forEach((image,index) => {
        data.append('images', {
            name: image, 
            type: 'image/png',
            uri: image
        })
    })

    // const config = {
    //     headers: {
    //         'content-type': 'multipart/form-data'
    //     }
    // }
    
    if(listing.location)
    data.append('location.latitude', JSON.stringify(listing.location.latitude))
    data.append('location.longitude', JSON.stringify(listing.location.longitude))

   return client.post('/listings', data, {
       onUploadProgress: (progress) => onUploadProgress(progress.loaded / progress.total)
   })
}

export default {
    getListings,
    addListing
}
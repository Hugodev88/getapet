const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
const Pet = require('../models/Pet')

module.exports = class PetController {

    static async create (req, res) {
        
        const {name, age, weight, color} = req.body

        const images = req.files

        const available = true

        if(!name){
            res.status(422).json({message: "O nome e obrigatorio"})
            return
        }
        
        if(!age){
            res.status(422).json({message: "A idade e obrigatoria"})
            return
        }

        if(!weight){
            res.status(422).json({message: "O peso e obrigatorio"})
            return
        }

        if(!color){
            res.status(422).json({message: "A cor e obrigatoria"})
            return
        }

        if(images.length === 0){
            res.status(422).json({message: "A imagem e obrigatoria"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            image: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        images.map((image)=> {
            pet.images.push(image.filename)
        })

        try {
            
            const newPet = await pet.save()
            res.status(201).json({message: "Pet cadastrado com sucesso", newPet})

        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({pets: pets})
    }

    static async getAllUserPets(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async getAllUserAdoptions(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})
    }

    static async getPetById(req, res) {

        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: "Id invalido"})
            return
        }

        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: "Pet nao encontrado"}) 
        }

        res.status(200).json({pet: pet})
        
    }

    static async removePetById(req, res) {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: "Id invalido"})
            return
        }

        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: "Pet nao encontrado"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar sua solicitacao"}) 
            return
        }

        await Pet.findByIdAndDelete(id)

        res.status(200).json({message: "Pet removido com sucesso"}) 

    }

    static async updatePet(req, res) {
        const id = req.params.id

        const {name, age, weight, color, available} = req.body

        const images = req.files

        const updatedData = {}

        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: "Pet nao encontrado"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar sua solicitacao"}) 
            return
        }

        if(!name){
            res.status(422).json({message: "O nome e obrigatorio"})
            return
        } else {
            updatedData.name = name
        }
        
        if(!age){
            res.status(422).json({message: "A idade e obrigatoria"})
            return
        } else {
            updatedData.age = age
        }

        if(!weight){
            res.status(422).json({message: "O peso e obrigatorio"})
            return
        } else {
            updatedData.weight = weight
        }

        if(!color){
            res.status(422).json({message: "A cor e obrigatoria"})
            return
        } else {
            updatedData.color = color
        }

        if(images.length > 0){      

            updatedData.images = []
            
            images.map((image) => {
                updatedData.images.push(image.filename);
            });
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: "Pet atualizado com sucesso."})

    }

    static async schedule(req, res) {

        const id = req.params.id

        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: "Pet nao encontrado"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)){
            res.status(422).json({message: "Voce nao pode agendar uma visita com o seu proprio pet"}) 
            return
        }
        
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({message: "Voce ja tem uma visita agendada com esse pet"}) 
                return
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`}) 

    }

    static async concludeAdoption(req, res) {
        
        const id = req.params.id

        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: "Pet nao encontrado"})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: "Houve um problema em processar sua solicitacao"}) 
            return
        }
        
        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: `Parabens, o pet foi adotado com sucesso.`}) 

    }
}
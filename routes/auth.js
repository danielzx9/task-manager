const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { exists } = require('../models/Task');

const router = express.Router();

router.post('/register', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'Proporciona un correo electronico valido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {username,email,password} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'El usuario ya esta registrado'});
        }

        user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });

        await user.save();

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});

    } catch(err){
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

router.post('/login', [
    check('email', 'Proporciona un correo electronico valido').isEmail(),
    check('password', 'la contraseña es obligatoria').exists(),
], async(req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});

    }

    const {email,password}= req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'credenciales incorrectas'});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:'Credenciales incorrectas'});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.json({token});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
}
);

module.exports = router;
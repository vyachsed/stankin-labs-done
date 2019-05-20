var express = require('express');
var router = express.Router();

const { createHash } = require('../utils');

const User = require("../models/User");

const { AUTH_COOKIE_NAME } = require("../utils/const");

router.use("/me", User.checkAuth()); //добавление middleware, для проверки токена при каждом запросе
router.get("/me", async (req, res) => {
    console.log("req.user me", req.user);
    const userId = req.user._id;
    if (!userId) {
        return res.json({
            status: "error",
            error: "Индетификатор пользователя не найден"
        });
    }

    try {
        const user = await User.findOne({ _id: userId });
        res.json({ status: "ok", user });
    } catch (err) {
    console.error(err);
    }
});

router.get('/logout', async (req, res) => {
    console.log("clear cookie");
    res.clearCookie(AUTH_COOKIE_NAME);
    res.json({status: "401", user: null});
    }
);

router.post("/login", async (req, res) => {
    console.log("req.body login", req.body);
    const user = await User.findOne({
        login: req.body.login,
        password: createHash(req.body.password)
    });
    if(!user) {
        return res.json({status: "error", error: "Неверный логин или пароль"});
    }
    res.cookie(
        AUTH_COOKIE_NAME,
        user.getJwtToken(),
        {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    );
    res.json({status: "ok", user});
});

router.post("/", async (req, res) => {
    console.log('req.body registration', req.body , req.cookies);
    const user = new User({
        login: req.body.login,
        password: createHash(req.body.password),
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });
    res.cookie(
        AUTH_COOKIE_NAME,
        user.getJwtToken(),
        {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }
    );
    user.save((err, user) => {
        if (err || !user) {
            return res.json({status: "error", error: "Произошла ошибка, проверьте корректность полей"});
        }
        res.cookie(
            AUTH_COOKIE_NAME,
            user.getJwtToken(),
            {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true
            }
        );
        res.json({status: "ok", user});
    })
});

module.exports = router;
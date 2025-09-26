const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id);
      done(null, user);
   } catch (err) {
      done(err, null);
   }
});

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL:
            process.env.NODE_ENV === "development" ? process.env.GOOGLE_DEV_CLIENT_CALLBACK_URL : process.env.GOOGLE_PROD_CLIENT_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
         let user = await User.findOne({ googleId: profile.id });
         if (!user) {
            user = await User.create({
               googleId: profile.id,
               displayName: profile.displayName,
               email: profile.emails[0].value,
               photo: profile.photos[0].value,
            });
         }
         return done(null, user);
      }
   )
);

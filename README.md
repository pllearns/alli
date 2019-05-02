# AlliBot: the facebook page and messenger bot for tech allies

[![BCH compliance](https://bettercodehub.com/edge/badge/pllearns/alli?branch=master)](https://bettercodehub.com/)

## Inspiration
**Opportunities for underserved communities in tech are still tough to come by.** 
My partner in hacking, Alissa and I thought that the best way to connect communities to tech, would be to serve those communities with the greatest obstacles to get through the leaky pipeline into tech. We felt that using Facebook Messenger and its bot capabilities would enable us to take this inspiration and create conversations that could do the work. 

## What it does
**Conversations are always a great way to connect people with opportunity.** AlliBot, an awesome ally bot is ready to help Facebook users from communities of color, women, and the LGBTQ community connect with events, jobs, and mentorships. Users can share events and jobs with Facebook friends, and there is a signup form for people to become mentors or to get mentorship. 

## How we built it
We used apis from the Facebook Messenger Platform, Meetup.com, Google Forms(for now) and Github jobs. We used nlp to create greetings based on the time of day and to introduce AlliBot to the user. We used Meetup for the upcoming events conversation and Github jobs for conversations about job opportunities. Finally as a temporary solution, we use Google Forms to sign up mentors and mentees. 

## Challenges we ran into
The api integration was challenging, but the ultimate challenge that will continue to persist throughout the development of this product is making sure that Alli stays engaging and human through all of her conversations with the end user.

## Accomplishments that we're proud of
Being able to create a robust starting point for a chatbot product, something we have never done before was awesome. Also, to be able to create a product that people have already responded to as having the potential for a positive impact, and we are starting to collect a list of trial users!

## What we learned
We learned how to interact with new apis that we have never touched before. We learned how to create a chat bot, which is awesome. 

## What's next for AlliBot
AlliBot is going to go through some testing with end users, go through a few rounds of enhancements/improvements. We are also going to develop the Facebook page for the app to host communities for group discussions, and explore ways that the chatbot can interact with groups. We also want to look into partnering with tech companies and organizations who are all in on diversity initiatives to see if we can develop a pipeline through AlliBot. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```
make sure you have npm 
```

### Installing

```
npm install 
npm run start:dev
```

You will also need to setup a app on the Facebook Developer Console and the Messenger Platform. Keep in mind that you won't be able to use the name AlliBot or the exact nlp and conversation style we use for this application. 

[Messenger Platform info](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start)

End with an example of getting some data out of the system or using it for a little demo

## Built With

* [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start) - FB Messenger Platform
* [Express](http://expressjs.com/en/api.html) - Express app 
* [GitHub Jobs API](https://jobs.github.com/api) - Used to generate job opportunities for chat 
* [Meetup API](https://www.meetup.com/meetup_api/) - Used to generate meetup events for chat

## Contributing

More info on this very soon! 

## Authors

* **Phillip Lorenzo** - *Initial work, rule building, api integration, project planning* - [GitHub](https://github.com/pllearns)
* **Alissa Renz** - *NLP, rule building, api integration, project planning* - [GitHub](https://github.com/alissarenz)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Alissa for being the best app building partner I could've asked for.
* To all women, LGTBQ, and people of color who are and who want to get into tech. Thank you for your inspiration.
* Eugene Baah for his motivation and consulting and Tope Alabi for staying on top of our deployment schedule.
* NeEddra James for her guidance and input on the project, and for helping me set my compass in a good direction.


'use strict';

const quizService = {
  getQuizServices,
};

function getQuizServices(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "list",
          elements: [
            {
              title: "The Balance Careers",
              subtitle: "Should you be a software engineer?",
              image_url: "https://www.thebalancecareers.com/thmb/UDf0H4yyVYNASSr2gGCqvr2mTjc=/300x200/filters:saturation(0.25):brightness(0):contrast(1):no_upscale():format(webp)/software-developer-quiz-57d6e9dd5f9b589b0a21b9c4.jpg",
              default_action: {
                type: "web_url",
                url: "https://www.thebalancecareers.com/should-you-be-a-software-developer-4100316",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            },
            {
              title: "LinkedIn",
              subtitle: "How to Know if Software Engineering is the Right Career For You",
              image_url: "https://content.linkedin.com/content/dam/me/learning/blog/2017/november/Software.Engineering.jpg",
              default_action: {
                type: "web_url",
                url: "https://learning.linkedin.com/blog/tech-tips/how-to-know-if-software-engineering-is-the-right-career-for-you",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            },
            {
              title: "The Guardian",
              subtitle: "10 signs a career in coding and software development might be right for you",
              image_url: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/1/10/1389357620256/Chess-board-009.jpg?w=620&q=20&auto=format&usm=12&fit=max&dpr=2&s=f769adae85c4e726913f57a41a164c09",
              default_action: {
                type: "web_url",
                url: "https://www.theguardian.com/careers/ten-signs-career-coding-software-development-right-for-you",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            }
          ]
        }
      }
    }
  }
}

module.exports = quizService;
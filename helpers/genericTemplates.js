function getGenericTemplates(recipientId, requestForHelpOnFeature) {
  console.log("[getGenericTemplates] handling help request for %s",
    requestForHelpOnFeature);
  var templateElements = [];
  var sectionButtons = [];

  // each button must be of type postback but title
  // and payload are variable depending on which
  // set of options you want to provide
  var addSectionButton = function (title, payload) {
    sectionButtons.push({
      type: 'postback',
      title: title,
      payload: payload
    });
  };

  // Since there are only four options in total, we will provide
  // buttons for each of the remaining three with each section.
  // This provides the user with maximum flexibility to navigate

  switch (requestForHelpOnFeature) {
    case 'QR_ROTATION_1':
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Rotation",
          subtitle: "portrait mode",
          image_url: IMG_BASE_PATH + "01-rotate-landscape.png",
          buttons: sectionButtons
        },
        {
          title: "Rotation",
          subtitle: "landscape mode",
          image_url: IMG_BASE_PATH + "02-rotate-portrait.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_PHOTO_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Photo Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "03-photo-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "Downloads folder",
          image_url: IMG_BASE_PATH + "04-photo-list.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "photo selected",
          image_url: IMG_BASE_PATH + "05-photo-selected.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_CAPTION_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Caption",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "06-text-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "enter text",
          image_url: IMG_BASE_PATH + "07-text-mid-entry.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "click OK",
          image_url: IMG_BASE_PATH + "08-text-entry-done.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "Caption done",
          image_url: IMG_BASE_PATH + "09-text-complete.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_BACKGROUND_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');

      templateElements.push(
        {
          title: "Background Color Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "10-background-picker-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click current color",
          image_url: IMG_BASE_PATH + "11-background-picker-appears.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "select new color",
          image_url: IMG_BASE_PATH + "12-background-picker-selection.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click ok",
          image_url: IMG_BASE_PATH + "13-background-picker-selection-made.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "color is applied",
          image_url: IMG_BASE_PATH + "14-background-changed.png",
          buttons: sectionButtons
        }
      );
      break;
  }

  if (templateElements.length < 2) {
    console.error("each template should have at least two elements");
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: templateElements
        }
      }
    }
  };

  return messageData;
}

module.exports = getGenericTemplates
// const TelegramBot = require('node-telegram-bot-api');
// const debug = require('./debug')
// // replace the value below with the Telegram token you receive from @BotFather
// const token = '6359231028:AAHVbYT-HSx7sl3IcnFhcbS3Ef9C0dK1DCY';

// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});
// console.log('telegram is working')
// // Matches "/echo [whatever]"
// // bot.onText(/\/echo (.+)/, (msg, match) => {
// //   // 'msg' is the received Message from Telegram
// //   // 'match' is the result of executing the regexp above on the text content
// //   // of the message

// //     const chatId = msg.chat.id;
// //   const resp = match[1]; // the captured "whatever"

// //   // send back the matched "whatever" to the chat
// //     bot.sendMessage(chatId, resp);
// // });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
// console.log(msg)
//   // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, `hey ,${msg.from.first_name}`)

// });
// bot.onText(/\/start/, (msg)=>{
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, debug(msg))

// })
// bot.onText(/\/help (.+)/, (msg , [source , match ] )=>{  // ba3at help w gambha msg hatraga3 2 value fe array 
//                                                         // arr = [source , match ]
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, debug(match))

// })
// bot.onText(/\/cours/ , msg  =>{
//     const html = `<strong> hello ${msg.from.last_name} </strong>
//     <i> course tody is : ${'axiso'} </i>
//     ${debug(msg)}`
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId ,html ,{
//         parse_mode:'HTML'
//     } )
// }
// )
//_____________________________________________
//  my
const TelegramBot = require('node-telegram-bot-api');
const debug = require('./debug')
// const btcValue = require('./getbitCoin');
const axios = require('axios');
const token = '6359231028:AAHVbYT-HSx7sl3IcnFhcbS3Ef9C0dK1DCY';
const bot = new TelegramBot(token, { polling: true });
const btcAddressPattern = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const userData = {};

// Define a function to start the form conversation
function startForm(chatId) {
    userData[chatId] = {};
    bot.sendMessage(chatId, `🗽 DW - обменный пункт
        🔄 Купить и продать криптовалюту
        🔙 Кэшбек на покупки.
        👛 Личный кошелёк внутри бота.
        💸 Деньги за отзывы и не только.
        👥 Реферальная система.
        🚀 Быстро, удобно, выгодно.`);
        setTimeout(()=>{
            bot.sendMessage(chatId, 'Welcome! ')
            setTimeout(() => {
                        bot.sendMessage(chatId, 'Добро пожаловать! Напишите свой ник ;):');
                    }, 1000);
        },1000)
        
    }
// Handle the "/start" command
    bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    startForm(chatId);
    });

    bot.onText(/\/cours/, (msg) => {
            const chatId = msg.chat.id;
            console.log(msg.text)
            const getBitcoinValueInRUB = async () => {
                try {
                    const response = await axios.
                    get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=rub')
                    const bitcoinValueInRUB = response.data.bitcoin.rub;
                    // console.log('Bitcoin value in RUB:', bitcoinValueInRUB);
                    bot.sendMessage(chatId,`Bitcoin value in RUB:', ${bitcoinValueInRUB}`)
                    } catch (error) {
                    // console.error('Error:', error.message);
                    bot.sendMessage(chatId,`Error:', ${ error.message}`)
                    }
                };
                getBitcoinValueInRUB();
    });
    bot.onText(/\/help/, (msg) => {
                const chatId = msg.chat.id;
    //             const helpMessage = `
    // <strong>hey ,${msg.from.first_name}</strong>
    // <strong>our site:http://xxxxxxxxxxxxxxxxx </strong>
    // <strong>our chat:@xxxxxxxxxxxx</strong>
    // <strong>help er :,@xxxxxxxxxxxx</strong>
    //             `
    //             bot.sendMessage(chatId,helpMessage , {
    //                 parse_mode:'HTML'
    //             })
    bot.sendMessage(chatId , 'keyboard' , {
        reply_markup:{
            inline_keyboard:[
                [
                    {
                        text:'google',
                        url:"https://www.google.com"
                    },
                    {
                        text:'google',
                        url:"https://www.google.com"
                    }
                ],
                [
                    {
                        text:'Our site',
                        url:"https://www.google.com"
                    }
                ],
                [
                    {
                        text:'Our site',
                        url:"https://www.google.com"
                    }
                ],
                [
                    {
                        text:'paid ',
                        callback_data:"paid"
                    },
                    {
                        text:' cancel',
                        callback_data:"cancel"
                    }
                ]
            ]
    }
})
    });
    // Handle text messages to collect form data
    bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if(text == '/start'){
        return
    }
    if(text == '/cours'){
        return
    }
    if(text == '/help'){
        return
    }
    if (!userData[chatId]) {
        startForm(chatId);
        return;
    }
    const keys = Object.keys(userData[chatId]);
    const currentStep = keys.length;
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=rub')
        .then(res =>{
            const btc =  res.data.bitcoin.rub;
            switch (currentStep) {
                //ask about name 
                case 0:
                userData[chatId].name = text;
                bot.sendMessage(chatId, 'На какую сумму Вы хотите купить Bitcoin ? ');
                
                break;
                case 1:
                userData[chatId].btc = text;
                if( userData[chatId].btc > 1){
                    bot.sendMessage(chatId, `⚠️ Вы ввели слишком большую сумму!\n
        (Напишите сумму: от 0.0001 до 0.1 BTC) \n
Но если Вы все же хотите приобрести: 0.221 BTC, то напишите: @xxxx. Сделаем быстро.`);
                    
            setTimeout(() => {
                bot.sendMessage(chatId, 'Попробуйте еще раз:  /start');
            }, 1000);
            delete userData[chatId];
                break;
                }
                else if(isNaN(userData[chatId].btc)){
                    bot.sendMessage(chatId, `⚠️ Oткрой глаза и напиши Цифры )`)
                    setTimeout(() => {
                        bot.sendMessage(chatId, ' Попробуйте еще раз :  /start');
                    }, 1000);
                    delete userData[chatId];
                break;
                }else{
                    bot.sendMessage(chatId, 'Здорова ! Пожалуйста, введите свой биткойн-кошелек');
                }
                break;
                case 2:
                userData[chatId].wallet = text;
                if (!btcAddressPattern.test( userData[chatId].wallet)){
                    bot.sendMessage(chatId, `⚠️ Oткрой глаза и напиши правильный кошелек )`)
                    setTimeout(() => {
                        bot.sendMessage(chatId, ' Попробуйте еще раз:  /start');
                    }, 1000);
                    delete userData[chatId];
                    break;
                }
//                 bot.sendMessage(chatId, 
//                     // 'Form data collected successfully:\n' +
//                     // `Name: ${userData[chatId].name } \n` +
//                     // `Rub: ${(userData[chatId].email * res.data.bitcoin.rub).toFixed(2)}rub \n` +
//                     // `btc wallet: ${userData[chatId].phone}`
// //                     `☑️ Ваша заявка №b4dd06 успешно создана!\n
// // ⏳ Статус: Ожидание оплаты \n
// // 💱 Сумма покупки: ${userData[chatId].email} BTC \n
// // 📮 Bitcoin-кошелёк:${userData[chatId].phone}\n
// // 💸 Сумма к оплате: ${(userData[chatId].email * res.data.bitcoin.rub).toFixed(2)}₽\n
// // 💳 Реквизиты: 4006 8011 0217 1961 \n
// // ⚠️ Если Вы перевели неправильную сумму, \n 
// //     то заявка будет  считаться неоплаченной.
// //     спользуйте раздел Помощь в главном меню,
// //     \n чтобы создать тикет`
//                     );
                    bot.sendMessage(chatId , 
        `☑️ Ваша заявка №b4dd06 успешно создана!\n
    ⏳ Статус: Ожидание оплаты \n
    💱 Сумма покупки: ${userData[chatId].btc} BTC \n
    📮 Bitcoin-кошелёк:
    ${userData[chatId].wallet}\n
    💸 Сумма к оплате: ${(userData[chatId].btc * res.data.bitcoin.rub).toFixed(2)}₽\n
    💳 Реквизиты:
    4006 8011 0217 1961 \n
    ⚠️Оплата производится через любые платежные системы: QIWI, перевод с карты на карту,наличные (терминал), Яндекс.Деньги, и другие платежные системы.\n
    ℹ️ После успешного перевода денег по указанным реквизитам нажмите на кнопку «✅Я оплатил(а)» или же Вы можете отменить данную заявку нажавна кнопку «❌Отменить заявку»\n
    ⚠️ ВАЖНО! Если Вы оплатите позже 23 минут и курс изменится в большую сторону,то мы будем вынуждены сделать перерасчёт стоимости по актуальному курсу!` 
    , {
            reply_markup:{
                inline_keyboard:[
                    [
                        {
                            text:'paid',
                            callback_data:"paid"
                        },
                        {
                            text:' cancel',
                            callback_data:"cancel"
                        }
                    ]
                ]
        }
    })

        console.log(userData[chatId])
        userData[chatId].rub = (userData[chatId].btc * res.data.bitcoin.rub).toFixed(2)
    break;
            }
        }).catch(error =>{
            console.log(error)
        })
    }
    );
console.log('Bot is running...,');

//callback inline keyboard 
bot.on('callback_query', query =>{
    let chatId = query.message.chat.id;
    if(query.data == 'cancel'){
        bot.sendMessage( chatId , query.data)
        delete userData[chatId]
        console.log(userData[chatId])
    }else{
        bot.sendMessage( chatId ,query.data)
        console.log(userData[chatId])
    }
})
    
// _____________________________________ ;'_____

// 3

// const TelegramBot = require('node-telegram-bot-api');

// // Replace 'YOUR_TOKEN' with your own Telegram bot token
// const token = '6359231028:AAHVbYT-HSx7sl3IcnFhcbS3Ef9C0dK1DCY';
// const bot = new TelegramBot(token, {polling: true});

// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   bot.sendMessage(chatId, 'Welcome to the form! Please enter your name.');
// });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const message = msg.text;

//   // State machine to handle the form
//   switch (message) {
//     case '/start':
//       break;
//     case 'cancel':
//       bot.sendMessage(chatId, 'Form canceled');
//       break;
//     case 'submit':
//       bot.sendMessage(chatId, 'Form submitted');
//       // Here, you can process the collected data
//       // For example, you can save the data to a database
//       break;
//     default:
//       // Store the previous message in the chat data object
//       const chatData = bot.getChat(chatId);
//       chatData.previousMessage = message;

//       // Ask for the next field
//       switch (chatData.previousMessage) {
//         case 'Welcome to the form! Please enter your name.':
//           bot.sendMessage(chatId, 'Please enter your email address.');
//           break;
//         case 'Please enter your email address.':
//           // Validate email address
//           if (!validateEmail(message)) {
//             bot.sendMessage(chatId, 'Invalid email address. Please enter a valid email address.');
//             return;
//           }
//           bot.sendMessage(chatId, 'Please enter your phone number.');
//           break;
//         case 'Please enter your phone number.':
//           // Validate phone number
//           if (!validatePhone(message)) {
//             bot.sendMessage(chatId, 'Invalid phone number. Please enter a valid phone number.');
//             return;
//           }

//           // Here, you can process the collected data
//           // For example, you can save the data to a database
//           bot.sendMessage(chatId, 'Thank you for submitting the form! You can type /start anytime to restart the form.');
//           break;
//       }
//       break;
//   }
// });

// // Helper function to validate email address
// function validateEmail(email) {
//   // Here, you can use your own email validation logic
//   return true; // Change this to your validation code
// }

// // Helper function to validate phone number
// function validatePhone(phone) {
//   // Here, you can use your own phone number validation logic
//   return true; // Change this to your validation code
// }
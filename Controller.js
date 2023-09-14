import pg from 'pg';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

dotenv.config()

const Controller = () => {
    console.log('Starting')

    cron.schedule('30 */16 * * *', () => {

        console.log('Controller is running');
        const connectionUrl = 'postgres://fhkusyjn:gjzNNlfVQ2xnHMrKTVl7mPr6O5rYCGbE@lallah.db.elephantsql.com/fhkusyjn'; //elephant sql connection url

        let client = new pg.Client(connectionUrl); //connection created

        client.connect((error) => { //connecting with database
            if (error) {
                return console.error('Could not connect to POSTGRES', error)
            }
            client.query('Select * from EMPLOYEE', (err, result) => { //executing query
                if (err) {
                    console.err('Error while executing query', err)
                }
                let todayDate = new Date().toString().slice(4, 10);

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    },
                });

                let empData = result.rows;

                for (let i = 0; i < empData.length; i = i + 2) {
                    let j = i + 2;
                    let mailSendTo = empData.slice(i, j)
                    mailSendTo.map((emp) => {
                        let empDob = emp.dob;
                        let preciseEmpDob = empDob.toString().slice(4, 10)
                        if (todayDate == preciseEmpDob) {
                            const info = transporter.sendMail({
                                from: '"Nishant Krishna Ghadigaonkar" <nishantkrishna1288@gmail.com>', // sender address
                                to: emp.email, // list of receivers
                                subject: `Happy Birthday ${emp.name}`, // Subject line
                                text: `Happy Birthday`, // plain text body
                                html: `<div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
                                <h1>Happy Birthday, ${emp.name}!</h1>
                                <p>On behalf of the entire GiliPro team, we want to extend our warmest birthday wishes to you today!</p>
                                <p>May your special day be filled with joy, laughter, and all the things that make you happiest. We hope you take some time today to relax, celebrate, and enjoy the company of your loved ones.</p>
                                <p>Once again, Happy Birthday,  ${emp.name}! Here's to another year of success and happiness.</p>
                                <p>Warmest wishes,</p>
                                <p>www.gili.pro<br>www.gili.co.in<br></p><br>
                                <p>If you want to unsubscribe. <a href="/unsubscribe">Click here</a></p>
                            </div>`, // html body
                            });
                        }
                    })
                    console.log('Mail Sent')
                }

                client.end()
                console.log('Finish Running')
            })

        })
    })
}

export default Controller;

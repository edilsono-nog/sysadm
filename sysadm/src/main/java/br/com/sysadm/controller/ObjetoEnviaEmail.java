package br.com.sysadm.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import br.com.sysadm.model.ConfigEmail;

public class ObjetoEnviaEmail {

	private String userName = null;
	private String senha = null;

	private String listaDestinatarios = "";
	private String nomeRemetente = "";
	private String assuntoEmail = "";
	private String textoEmail = "";

	public ObjetoEnviaEmail(String listaDestinatario, String nomeRemetente, String assuntoEmail, String textoEmail) {
		this.listaDestinatarios = listaDestinatario;
		this.nomeRemetente = nomeRemetente;
		this.assuntoEmail = assuntoEmail;
		this.textoEmail = textoEmail;
	}

	public void enviarEmail(boolean envioHtml, ConfigEmail configemail) throws Exception {
		
		userName = configemail.getEmail();
		senha = configemail.getSenha();

		Properties properties = new Properties();
		properties.put("mail.smtp.ssl.trust", "*");
		properties.put("mail.smtp.auth", "true");/* Autorização */
		properties.put("msil.smtp.starttls", "true");/* Autenticação */
		properties.put("mail.smtp.host", configemail.getHost());/* Servidor Gmail Google */
		properties.put("mail.smtp.port", configemail.getPort());/* Porta do servidor */
		properties.put("mail.smtp.socketFactory.port", configemail.getPort());/* Expecifica a porta a ser conectada pelo socket */
		properties.put("mail.smtp.socketFactory.class",
				"javax.net.ssl.SSLSocketFactory");/* Classe socket de conexão ao SMTP */

		Session session = Session.getInstance(properties, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(userName, senha);
			}
		});

		Address[] toUser = InternetAddress.parse(listaDestinatarios);

		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress(userName, nomeRemetente));/* Quem esta enviando */
		message.setRecipients(Message.RecipientType.TO, toUser);/* Email de destino */
		message.setSubject(assuntoEmail);/* Assunto do email */

		if (envioHtml) {
			message.setContent(textoEmail, "text/html; charset=utf-8");
		} else {
			message.setText(textoEmail);
		}

		Transport.send(message);
	}

	public void enviarEmailAnexo(boolean envioHtml) throws Exception {

		userName = "edilsono.nog@gmail.com";
		senha = "ctlkahaaclmbyann";

		Properties properties = new Properties();
		properties.put("mail.smtp.ssl.trust", "*");
		properties.put("mail.smtp.auth", "true");/* Autorização */
		properties.put("msil.smtp.starttls", "true");/* Autenticação */
		properties.put("mail.smtp.host", "smtp.gmail.com");/* Servidor Gmail Google */
		properties.put("mail.smtp.port", "465");/* Porta do servidor */
		properties.put("mail.smtp.socketFactory.port", "465");/* Expecifica a porta a ser conectada pelo socket */
		properties.put("mail.smtp.socketFactory.class",
				"javax.net.ssl.SSLSocketFactory");/* Classe socket de conexão ao SMTP */

		Session session = Session.getInstance(properties, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(userName, senha);
			}
		});

		Address[] toUser = InternetAddress.parse(listaDestinatarios);

		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress(userName, nomeRemetente));/* Quem esta enviando */
		message.setRecipients(Message.RecipientType.TO, toUser);/* Email de destino */
		message.setSubject(assuntoEmail);/* Assunto do email */

		/* Parte 1 do e-mail que é texto e a descrição do e-mail */
		MimeBodyPart corpoEmail = new MimeBodyPart();

		if (envioHtml) {
			corpoEmail.setContent(textoEmail, "text/html; charset=utf-8");
		} else {
			corpoEmail.setText(textoEmail);
		}

		List<FileInputStream> arquivos = new ArrayList<FileInputStream>();
		arquivos.add(simuladorDePDF());
		arquivos.add(simuladorDePDF());
		arquivos.add(simuladorDePDF());
		arquivos.add(simuladorDePDF());

		Multipart multipart = new MimeMultipart();
		multipart.addBodyPart(corpoEmail);

		int index = 0;
		for (FileInputStream fileInputStream : arquivos) {

			/* Parte 2 do e-mail que são os anexo em pdf */
			MimeBodyPart anexoEmail = new MimeBodyPart();

			/*
			 * Onde é passado o simuladorDePDF você passa o seu arquivo gravado no banco de
			 * dados
			 */
			anexoEmail.setDataHandler(new DataHandler(new ByteArrayDataSource(fileInputStream, "application/pdf")));
			anexoEmail.setFileName("anexoemail" + index + ".pdf");

			multipart.addBodyPart(anexoEmail);

			index++;
		}

		message.setContent(multipart);

		Transport.send(message);
	}

	/*
	 * Esse método simula o PDF ou qualquer arquivo que posa ser enviado por anexo
	 * do email Voce pode pegar o arquivo no seu banco de dados base64, byte[],
	 * Stream de arquivos. Pde estar e um banco de dados, ou em uma pasta.
	 * 
	 * Retorna um PDF em branco com o texto do Paragrafo de exemplo
	 */
	private FileInputStream simuladorDePDF() throws Exception {
		Document document = new Document();
		File file = new File("fileanexo.pdf");
		file.createNewFile();
		PdfWriter.getInstance(document, new FileOutputStream(file));
		document.open();
		document.add(new Paragraph("Conteudo do PDF anexo com Java Mail, esse texto é do PDF"));
		document.close();

		return new FileInputStream(file);

	}

}

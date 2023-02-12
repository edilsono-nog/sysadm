package br.com.sysadm.controller;

import java.io.File;
import java.io.Serializable;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.springframework.stereotype.Component;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;

@Component
public class ReportUtil implements Serializable {
	
	/*Retorna nosso PDF em Byte para download no navegador*/
	public byte[] gerarRelatorio(List listDados, String relatorio, ServletContext servletContext) throws Exception{
		
		/*Cria a lista de dados para p relatorio com nossa lista de objetos para iprimir*/
		JRBeanCollectionDataSource jrbcds = new JRBeanCollectionDataSource(listDados);
		
		URL web = getClass().getResource("/relatorios/"+ relatorio +".jasper");
		
		if (web == null) {
			/*Carrega o caminho do arquivo jasper compilado*/
			String caminhoJasper = servletContext.getRealPath("relatorios") + File.separator + relatorio + ".jasper";
			/*Carrega o arquivo Jasper passando os dados*/
			JasperPrint impressoraJasper = JasperFillManager.fillReport(caminhoJasper, new HashMap(), jrbcds);
			/*Exporta para byte[] para fazer o download do PDF*/
			return JasperExportManager.exportReportToPdf(impressoraJasper);
		}else {
			JasperReport caminhoJasper = (JasperReport) JRLoader.loadObject( web );
			/*Carrega o arquivo Jasper passando os dados*/
			JasperPrint impressoraJasper = JasperFillManager.fillReport(caminhoJasper, new HashMap(), jrbcds);
			/*Exporta para byte[] para fazer o download do PDF*/
			return JasperExportManager.exportReportToPdf(impressoraJasper);
		}

	}

	public byte[] gerarRelatorios(List listDados, String relatorio, Map<String, Object> parametros,
			ServletContext servletContext) throws Exception {
		
		//*Cria a lista de dados para p relatorio com nossa lista de objetos para iprimir*/
		JRBeanCollectionDataSource jrbcds = new JRBeanCollectionDataSource(listDados);
		
		URL web = getClass().getResource("/relatorios/"+relatorio+".jasper");
		
		if (web == null) {
			/*Carrega o caminho do arquivo jasper compilado*/
			String caminhoJasper = servletContext.getRealPath("relatorios") + File.separator + relatorio + ".jasper";
			JasperPrint impressoraJasper = JasperFillManager.fillReport(caminhoJasper, parametros, jrbcds);
			/*Exporta para byte[] para fazer o download do PDF*/
			return JasperExportManager.exportReportToPdf(impressoraJasper);
		}else {
			JasperReport caminhoJasper = (JasperReport) JRLoader.loadObject( web );
			/*Carrega o arquivo Jasper passando os dados*/
			JasperPrint impressoraJasper = JasperFillManager.fillReport(caminhoJasper, parametros, jrbcds);
			/*Exporta para byte[] para fazer o download do PDF*/
			return JasperExportManager.exportReportToPdf(impressoraJasper);
		}
	}

}

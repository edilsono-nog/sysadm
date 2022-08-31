package br.com.sysadm.converter;

import br.com.sysadm.Dto.ResponsaveisDto;
import br.com.sysadm.model.Responsaveis;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class EntityRespDtoConverter {
	
	public static ResponsaveisDto entityToDto(Responsaveis responsaveis) {
		ResponsaveisDto responsaveisDto = new ResponsaveisDto();
		
		responsaveisDto.setId(responsaveis.getId());
		responsaveisDto.setNome(responsaveis.getNome());
		responsaveisDto.setDt_nasc(responsaveis.getDt_nasc());
		responsaveisDto.setEmail(responsaveis.getEmail());
		responsaveisDto.setCelular(responsaveis.getCelular());
		
		return responsaveisDto;
	}
	
	public static Responsaveis dtoToEntity(ResponsaveisDto responsaveisDto) {
		Responsaveis responsaveis = new Responsaveis();
		
		responsaveis.setId(responsaveisDto.getId());
		responsaveis.setNome(responsaveisDto.getNome());
		responsaveis.setDt_nasc(responsaveisDto.getDt_nasc());
		responsaveis.setEmail(responsaveisDto.getEmail());
		responsaveis.setCelular(responsaveisDto.getCelular());
		
		return responsaveis;
	}

}

package br.com.sysadm.converter;

import br.com.sysadm.Dto.AlunosDto;
import br.com.sysadm.model.Alunos;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class EntityDtoConverter {
	
	public static AlunosDto entityToDto(Alunos alunos) {
		AlunosDto alunosDto = new AlunosDto();
		
		alunosDto.setId(alunos.getId());
		alunosDto.setNome(alunos.getNome());
		alunosDto.setDt_nasc(alunos.getDt_nasc());
		alunosDto.setEmail(alunos.getEmail());
		alunosDto.setCelular(alunos.getCelular());
		
		return alunosDto;
	}
	
	public static Alunos dtoToEntity(AlunosDto alunosDto) {
		Alunos alunos = new Alunos();
		
		alunos.setId(alunosDto.getId());
		alunos.setNome(alunosDto.getNome());
		alunos.setDt_nasc(alunosDto.getDt_nasc());
		alunos.setEmail(alunosDto.getEmail());
		alunos.setCelular(alunosDto.getCelular());
		
		return alunos;
	}

}

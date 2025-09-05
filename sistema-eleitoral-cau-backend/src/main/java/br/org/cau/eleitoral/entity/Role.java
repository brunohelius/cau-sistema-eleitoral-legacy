package br.org.cau.eleitoral.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_role")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public Role() {}

    public Role(ERole name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Role role = (Role) obj;
        return id != null && id.equals(role.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public enum ERole {
        ROLE_ADMIN,
        ROLE_COMISSAO_ELEITORAL,
        ROLE_CONSELHEIRO,
        ROLE_PROFISSIONAL,
        ROLE_OPERADOR
    }
}
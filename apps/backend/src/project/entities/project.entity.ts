import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => ProjectRole, (role) => role.project)
  roles: ProjectRole[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}

@Entity('project_roles')
export class ProjectRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.roles)
  project: Project;

  @Column()
  name: string; // e.g. "Owner", "Frontend Dev"

  @Column('jsonb', { default: {} })
  permissions: Record<string, boolean>; // flexible permissions
}

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Project, (project) => project.members)
  project: Project;

  @ManyToOne(() => ProjectRole)
  role: ProjectRole;
}

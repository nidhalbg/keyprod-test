import { ObjectIdColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

export abstract class BaseEntity {

  @ObjectIdColumn()
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ example: 1, description: 'Entity id' })
  id?: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ name: 'created_date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate?: Date;

  @Column({ name: 'last_modified by', nullable: true })
  lastModifiedBy?: string;

  @Column({ name: 'last_modified_date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  lastModifiedDate?: Date;

}

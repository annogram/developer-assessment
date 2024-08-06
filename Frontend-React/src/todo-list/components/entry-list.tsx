import { FC, useEffect, useState } from "react";
import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { Todo } from "../types/entry";
import { useDebouncedCallback } from "use-debounce";

export interface EntryListProps {
  items: Todo[];
  handleDescriptionUpdated: (item: Todo, description: string) => void;
  onCheckItemChanged: (item: Todo, completed: boolean) => void;
}

export const EntryList: FC<EntryListProps> = ({
  items,
  handleDescriptionUpdated,
  onCheckItemChanged
}) => {
  
  const [descriptions, setDescriptions] = useState<Record<string, string>>(items.reduce((acc, item) => {
    acc[item.id] = item.description;
    return acc;
  }, {} as Record<string, string>));

  const debouncedDescriptionUpdate = useDebouncedCallback((item: Todo) => {  
    handleDescriptionUpdated(item, descriptions[item.id]);
  }, 1500);


  const handleLiveDescriptionUpdated = (item: Todo, description: string) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [item.id]: description
    }));

    debouncedDescriptionUpdate(item);
  }

  // for initial render to allow for live updating
  useEffect(() => {
    setDescriptions(items.reduce((acc, item) => {
      acc[item.id] = item.description;
      return acc;
    }, {} as Record<string, string>));
  }, [items, setDescriptions]);

  console.log(descriptions);
  return <>
    <Row className="b-0 rounded-0">
      <Col xs={12} className="justify-content-center">
        <h1>Showing {items.length} Item(s)</h1>
      </Col>
    </Row>

    {Object.entries(descriptions).map(([id, description]) => {
      const item = items.find(item => item.id === id);
      if (!item) return null;
      return (
        <Row key={id}>
          <Col>
            <InputGroup className="b-0 rounded-0" aria-label="Todo Item">
              <InputGroup.Checkbox 
                id={id} 
                checked={item.isCompleted} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {onCheckItemChanged(item, !item.isCompleted)}}
              />
              <Form.Control 
                id={id} 
                value={description} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLiveDescriptionUpdated(item, e.target.value)} 
              />
            </InputGroup>
          </Col>
        </Row>
      );
    })}
  </>

  //     return <>
  //     <h1>
  //       Showing {items.length} Item(s){' '}
  //       <Button variant="primary" className="pull-right" onClick={() => getItems()}>
  //         Refresh
  //       </Button>
  //     </h1>


  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>Id</th>
  //           <th>Description</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {items.map((item) => (
  //           <tr key={item.id}>
  //             <td>{item.id}</td>
  //             <td>{item.description}</td>
  //             <td>
  //               <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
  //                 Mark as completed
  //               </Button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </Table>
  //   </>
}
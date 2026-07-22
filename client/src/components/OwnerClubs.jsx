import axios from "axios";
import { useEffect, useState } from "react";

function OwnerClubs() {
    
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        getData();
    },[])

    const getData = () => {
     
        axios.get("http://localhost:8080/api/clubs", {
            params: {
                ownerId: 1
            }
        }).then((result) => {

            if(result.data != null) {
                console.log(result.data);
                setClubs(result.data);
            }
            else {
                console.log("Error in getting clubs by owner id");
            }
        }).catch((err) => {

            console.log(err);
        })
    }
    return ( 

        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>OwnerName</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((c) => {

                            return (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.address}</td>
                                    <td>{c.city}</td>
                                    <td>{c.basePrice}</td>
                                    <td>{c.status}</td>
                                    <td>{c.ownerFirstName}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
     );
}

export default OwnerClubs;
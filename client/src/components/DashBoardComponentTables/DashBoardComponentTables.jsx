import { Button, Table } from 'flowbite-react';
import React from 'react'
import { NavLink } from 'react-router-dom';

function DashBoardComponentTables({content,dataType}) {
    console.log(content);
    
  return (
    <div className="">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
                <h1 className='text-center p-2 '>
                    {dataType==="Users" && "Recent Users"}
                    {dataType==="Comments" && "Recent Comments"}
                    {dataType==="Posts" && "Recent Posts"}
                </h1>
                <Button outline gradientDuoTone={"purpleToPink"}>
                    <NavLink to={`/dashboard?tab=${dataType.toLowerCase()}`}>See All</NavLink>
                </Button>
            </div>
            <Table hoverable className='h-96'>
                <Table.Head>
                    {dataType==="Users" &&
                    <> <Table.HeadCell>
                        User Image
                    </Table.HeadCell>
                    <Table.HeadCell className='text-center'>
                        Username
                    </Table.HeadCell>
                    </>
                    }

                    {dataType==="Comments" &&
                    <> <Table.HeadCell>
                       Comment Content
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Likes
                    </Table.HeadCell>
                    </>
                    }

                    {dataType==="Posts" &&
                    <> <Table.HeadCell>
                       Post Image
                    </Table.HeadCell>
                    <Table.HeadCell>
                       Post Title
                    </Table.HeadCell>
                    <Table.HeadCell>
                       Category
                    </Table.HeadCell>
                    </>
                    }
                    
                </Table.Head>
                {content && content.map((con)=>(
                    <Table.Body key={con._id} className='divide-y'>
                        <Table.Row className='text-white dark:border-gray-700dark:bg-gray-800'>
                           {dataType==="Users" && <> <Table.Cell>
                               <img src={con?.image} alt="user image" 
                               className='w-10 h-10 ronuded-full bg-gray-500'
                               />
                            </Table.Cell>
                            <Table.Cell className='w-52 text-center'>
                                <NavLink to={`/u/${con?.username}`} >
                                    {con?.username}
                                </NavLink>
                            </Table.Cell>
                            </>
                            }

                           {dataType==="Comments" && <> <Table.Cell className='w-96'>
                               <p className='line-clamp-2'>{con.content}</p>
                            </Table.Cell>
                            <Table.Cell>
                                {/* <NavLink to={`/u/${con?.username}`} > */}
                                    {con?.numberOfLikes}
                                {/* </NavLink> */}
                            </Table.Cell>
                            </>
                            }

{dataType==="Posts" && <> <Table.Cell>
                               <img src={con?.image} alt="user image" 
                               className='w-10 h-10 ronuded-full bg-gray-500'
                               />
                            </Table.Cell>
                            <Table.Cell className='w-96'>
                                <NavLink to={`/posts/${con?.slug}`} >
                                    {con?.title}
                                </NavLink>
                            </Table.Cell>
                            <Table.Cell>
                                {/* <NavLink to={`/u/${con?.title}`} > */}
                                    {con?.category}
                                {/* </NavLink> */}
                            </Table.Cell>
                            </>
                            }

                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
        </div>
    </div>
  )
}

export default DashBoardComponentTables;
// ─── Types ─────────────────────────────────────────────────────────────────

export type UserRole    = "Task Doer" | "Task Giver" | "Both"
export type UserStatus  = "Active" | "Suspended" | "Shadow Banned" | "Banned" | "Pending KYC"
export type TaskStatus  = "Matching" | "In Progress" | "Completed" | "Disputed" | "Force-Closed"
export type DispStatus  = "Unassigned" | "In Progress" | "Evidence Pending" | "Escalated" | "Resolved"
export type Priority    = "Critical" | "High" | "Medium" | "Low"
export type PayStatus   = "In Escrow" | "Released" | "Refunded" | "Disputed" | "Failed"
export type TktStatus   = "Open" | "Pending Reply" | "Unassigned" | "Resolved"
export type TeamRole    = "Super Admin" | "Admin" | "Support Agent" | "Viewer"
export type ActivityType =
  | "task_posted" | "dispute_opened" | "payout" | "user_signup"
  | "kyc_verified" | "payment_released" | "task_completed" | "trust_signal"

// ─── Users (25 rows) ────────────────────────────────────────────────────────

export interface MockUser {
  id: string; name: string; email: string; phone: string
  role: UserRole; status: UserStatus; city: string
  trustScore: number; tasks: number; joinedAt: string
  isVerified: boolean; upiId?: string
}

export const MOCK_USERS: MockUser[] = [
  { id:"USR-0002", name:"Rahul Mehta",    email:"rahul.m@outlook.com",  phone:"+91 98765 43210", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:76, tasks:14, joinedAt:"Jan 2025", isVerified:true,  upiId:"rahul.m@oksbi"   },
  { id:"USR-0003", name:"Anita Desai",    email:"anita.d@yahoo.com",    phone:"+91 91234 56789", role:"Both",        status:"Active",         city:"Delhi NCR",  trustScore:84, tasks:24, joinedAt:"Mar 2025", isVerified:true,  upiId:"anita.d@paytm"   },
  { id:"USR-0004", name:"Vikram Kumar",   email:"vikram.k@gmail.com",   phone:"+91 87654 32109", role:"Task Doer",   status:"Shadow Banned",  city:"Pune",       trustScore:31, tasks:14, joinedAt:"Feb 2025", isVerified:false                          },
  { id:"USR-0005", name:"Priya Sharma",   email:"priya.s@hotmail.com",  phone:"+91 99887 76655", role:"Task Doer",   status:"Suspended",      city:"Hyderabad",  trustScore:67, tasks:14, joinedAt:"Dec 2024", isVerified:true,  upiId:"priya.s@hdfcbank"},
  { id:"USR-0006", name:"Sneha Reddy",    email:"sneha.r@gmail.com",    phone:"+91 77665 54433", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:76, tasks:14, joinedAt:"Apr 2025", isVerified:true,  upiId:"sneha.r@icici"   },
  { id:"USR-0007", name:"Arjun Singh",    email:"arjun.s@gmail.com",    phone:"+91 88776 65544", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:76, tasks:14, joinedAt:"May 2025", isVerified:true,  upiId:"arjun.s@ybl"     },
  { id:"USR-0008", name:"Karthik Iyer",   email:"karthik.i@gmail.com",  phone:"+91 76543 21098", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:76, tasks:14, joinedAt:"Mar 2025", isVerified:true                           },
  { id:"USR-0009", name:"Divya Nair",     email:"divya.n@gmail.com",    phone:"+91 98123 45678", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:76, tasks:14, joinedAt:"Feb 2025", isVerified:true,  upiId:"divya.n@oksbi"   },
  { id:"USR-0010", name:"Rohan Das",      email:"rohan.d@gmail.com",    phone:"+91 99001 12233", role:"Task Giver",  status:"Banned",         city:"Jaipur",     trustScore:22, tasks:4,  joinedAt:"Jan 2025", isVerified:false                          },
  { id:"USR-0011", name:"Pooja Gupta",    email:"pooja.g@gmail.com",    phone:"+91 89012 34567", role:"Task Doer",   status:"Active",         city:"Mumbai",     trustScore:94, tasks:67, joinedAt:"Sep 2024", isVerified:true,  upiId:"pooja.g@paytm"   },
  { id:"USR-0012", name:"Suresh Pillai",  email:"suresh.p@rediff.com",  phone:"+91 94030 55678", role:"Task Doer",   status:"Active",         city:"Chennai",    trustScore:88, tasks:41, joinedAt:"Jun 2024", isVerified:true,  upiId:"suresh.p@axisb"  },
  { id:"USR-0013", name:"Meena Krishnan", email:"meena.k@gmail.com",    phone:"+91 80001 22334", role:"Both",        status:"Active",         city:"Bengaluru",  trustScore:79, tasks:29, joinedAt:"Nov 2024", isVerified:true,  upiId:"meena.k@ybl"     },
  { id:"USR-0014", name:"Raj Patel",      email:"raj.p@gmail.com",      phone:"+91 79990 00001", role:"Task Giver",  status:"Active",         city:"Ahmedabad",  trustScore:65, tasks:18, joinedAt:"Jul 2024", isVerified:true,  upiId:"raj.p@hdfcbank"  },
  { id:"USR-0015", name:"Tanvi Bose",     email:"tanvi.b@yahoo.com",    phone:"+91 98780 11223", role:"Task Doer",   status:"Pending KYC",    city:"Kolkata",    trustScore:55, tasks:9,  joinedAt:"Apr 2025", isVerified:false                          },
  { id:"USR-0016", name:"Deepak Verma",   email:"deepak.v@gmail.com",   phone:"+91 70011 22334", role:"Task Doer",   status:"Active",         city:"Delhi NCR",  trustScore:83, tasks:36, joinedAt:"Aug 2024", isVerified:true,  upiId:"deepak.v@oksbi"  },
  { id:"USR-0017", name:"Aisha Khan",     email:"aisha.k@gmail.com",    phone:"+91 98630 44556", role:"Task Giver",  status:"Active",         city:"Hyderabad",  trustScore:72, tasks:21, joinedAt:"Mar 2025", isVerified:true,  upiId:"aisha.k@paytm"   },
  { id:"USR-0018", name:"Mohan Joshi",    email:"mohan.j@gmail.com",    phone:"+91 77800 55667", role:"Task Doer",   status:"Suspended",      city:"Pune",       trustScore:48, tasks:7,  joinedAt:"Dec 2024", isVerified:false                          },
  { id:"USR-0019", name:"Kavya Rao",      email:"kavya.r@gmail.com",    phone:"+91 91100 66778", role:"Both",        status:"Active",         city:"Bengaluru",  trustScore:91, tasks:52, joinedAt:"Oct 2024", isVerified:true,  upiId:"kavya.r@icici"   },
  { id:"USR-0020", name:"Sanjay Mehta",   email:"sanjay.m@gmail.com",   phone:"+91 99200 77889", role:"Task Giver",  status:"Active",         city:"Surat",      trustScore:68, tasks:16, joinedAt:"Feb 2025", isVerified:true,  upiId:"sanjay.m@upi"    },
  { id:"USR-0021", name:"Lakshmi Reddy",  email:"lakshmi.r@gmail.com",  phone:"+91 88900 88990", role:"Task Doer",   status:"Active",         city:"Chennai",    trustScore:86, tasks:44, joinedAt:"Jan 2025", isVerified:true,  upiId:"lakshmi.r@oksbi" },
  { id:"USR-0022", name:"Amit Sharma",    email:"amit.s@gmail.com",     phone:"+91 70020 99001", role:"Task Doer",   status:"Shadow Banned",  city:"Jaipur",     trustScore:28, tasks:3,  joinedAt:"Mar 2025", isVerified:false                          },
  { id:"USR-0023", name:"Nisha Chopra",   email:"nisha.c@gmail.com",    phone:"+91 98010 10111", role:"Task Giver",  status:"Active",         city:"Mumbai",     trustScore:73, tasks:19, joinedAt:"Nov 2024", isVerified:true,  upiId:"nisha.c@paytm"   },
  { id:"USR-0024", name:"Gopal Nair",     email:"gopal.n@gmail.com",    phone:"+91 91880 20223", role:"Task Doer",   status:"Active",         city:"Kochi",      trustScore:81, tasks:33, joinedAt:"Sep 2024", isVerified:true,  upiId:"gopal.n@hdfcbank"},
  { id:"USR-0025", name:"Ritika Singh",   email:"ritika.s@gmail.com",   phone:"+91 77010 30334", role:"Task Giver",  status:"Pending KYC",    city:"Delhi NCR",  trustScore:60, tasks:11, joinedAt:"Apr 2025", isVerified:false                          },
  { id:"USR-0026", name:"Farhan Qureshi", email:"farhan.q@gmail.com",   phone:"+91 98770 40445", role:"Task Doer",   status:"Active",         city:"Bengaluru",  trustScore:87, tasks:49, joinedAt:"Jul 2024", isVerified:true,  upiId:"farhan.q@icici"  },
]

// ─── Tasks (25 rows) ────────────────────────────────────────────────────────

export interface MockTask {
  id: string; title: string; category: string
  giver: string; doer?: string; amount: number
  status: TaskStatus; postedAt: string; nearbyDoers?: number
  city: string; description?: string
}

export const MOCK_TASKS: MockTask[] = [
  { id:"TSK-19255", title:"Logo design for new cafe",             category:"Design",      giver:"Sneha Joshi",  amount:450,    status:"Matching",    postedAt:"4m ago",   nearbyDoers:6, city:"Mumbai",    description:"Create a modern logo for a specialty coffee cafe. Deliverables: 3 concepts, final vector files." },
  { id:"TSK-19254", title:"Help logo design for new cafe",        category:"Design",      giver:"Sneha Joshi",  doer:"Vikram Kumar", amount:450, status:"In Progress",  postedAt:"24m ago",  city:"Bengaluru" },
  { id:"TSK-19253", title:"React Native bug fixes — 10 issues",  category:"Development", giver:"Arjun Singh",  doer:"Karan Patel",  amount:3200, status:"Completed",   postedAt:"24m ago",  city:"Pune"      },
  { id:"TSK-19252", title:"WordPress website redesign",           category:"Development", giver:"Karan Patel",  amount:4500,  status:"Force-Closed", postedAt:"12h ago",  city:"Delhi NCR"  },
  { id:"TSK-19251", title:"Python data pipeline automation",      category:"Development", giver:"Karan Patel",  doer:"Vikram Kumar", amount:4500, status:"Disputed",    postedAt:"12h ago",  city:"Mumbai"    },
  { id:"TSK-19250", title:"Mobile UI/UX design for e-commerce",  category:"Design",      giver:"Priya Mehta",  doer:"Rahul Sharma", amount:22000,status:"In Progress",  postedAt:"Just now", city:"Mumbai"    },
  { id:"TSK-19249", title:"Content writing — 10 blog posts",     category:"Writing",     giver:"Divya Nair",   doer:"Ananya Reddy", amount:2800, status:"Completed",   postedAt:"1h ago",   city:"Hyderabad" },
  { id:"TSK-19248", title:"Brand identity package",               category:"Design",      giver:"Sanjay Mehta", doer:"Karthik Iyer", amount:8000, status:"In Progress",  postedAt:"2h ago",   city:"Bengaluru" },
  { id:"TSK-19247", title:"Social media reels — 5 videos",       category:"Video",       giver:"Aisha Khan",   amount:3500,  status:"Matching",    postedAt:"5m ago",   nearbyDoers:3, city:"Pune"       },
  { id:"TSK-19246", title:"Shopify store setup + customization",  category:"Development", giver:"Raj Patel",    doer:"Deepak Verma", amount:5200, status:"Completed",   postedAt:"3h ago",   city:"Ahmedabad" },
  { id:"TSK-19245", title:"Email marketing campaigns — Q2",      category:"Marketing",   giver:"Nisha Chopra", doer:"Tanvi Bose",   amount:3800, status:"Completed",   postedAt:"5h ago",   city:"Mumbai"    },
  { id:"TSK-19244", title:"Figma design system for SaaS app",    category:"Design",      giver:"Gopal Nair",   doer:"Meena Krishnan",amount:12000,status:"In Progress", postedAt:"1d ago",   city:"Kochi"     },
  { id:"TSK-19243", title:"SEO audit and optimization report",    category:"Marketing",   giver:"Ritika Singh", amount:1800,  status:"Matching",    postedAt:"10m ago",  nearbyDoers:2, city:"Delhi NCR"  },
  { id:"TSK-19242", title:"Android app testing — 50 test cases", category:"QA Testing",  giver:"Rohan Das",    doer:"Amit Sharma",  amount:4200, status:"Disputed",    postedAt:"2d ago",   city:"Kolkata"   },
  { id:"TSK-19241", title:"Photography — product catalog 40 SKUs",category:"Photography",giver:"Lakshmi Reddy",doer:"Farhan Qureshi",amount:6500,status:"In Progress",  postedAt:"1d ago",   city:"Chennai"   },
  { id:"TSK-19240", title:"Copywriting — landing page 5 sections",category:"Writing",    giver:"Suresh Pillai",doer:"Kavya Rao",    amount:1500, status:"Completed",   postedAt:"2d ago",   city:"Chennai"   },
  { id:"TSK-19239", title:"HR policy document — 30 pages",       category:"Writing",     giver:"Mohan Joshi",  amount:2200,  status:"Matching",    postedAt:"15m ago",  nearbyDoers:4, city:"Pune"       },
  { id:"TSK-19238", title:"AWS infrastructure setup",             category:"DevOps",      giver:"Vikram Kumar", doer:"Arjun Singh",  amount:9500, status:"Force-Closed", postedAt:"3d ago",  city:"Hyderabad" },
  { id:"TSK-19237", title:"Illustration pack — 20 icons",        category:"Design",      giver:"Anita Desai",  doer:"Priya Sharma", amount:3100, status:"Completed",   postedAt:"2d ago",   city:"Delhi NCR" },
  { id:"TSK-19236", title:"Bookkeeping — 3 months reconciliation",category:"Finance",    giver:"Pooja Gupta",  doer:"Sanjay Mehta", amount:4800, status:"Completed",   postedAt:"4d ago",   city:"Jaipur"    },
  { id:"TSK-19235", title:"Video editing — 10 YouTube videos",   category:"Video",       giver:"Karthik Iyer", doer:"Rohan Das",    amount:7200, status:"Disputed",    postedAt:"2d ago",   city:"Bengaluru" },
  { id:"TSK-19234", title:"SQL database migration — MySQL→Postgres",category:"Development",giver:"Deepak Verma",doer:"Suresh Pillai",amount:6000,status:"In Progress",  postedAt:"1d ago",   city:"Delhi NCR" },
  { id:"TSK-19233", title:"Customer support scripting — 50 templates",category:"Writing",giver:"Nisha Chopra", doer:"Kavya Rao",    amount:2600, status:"Completed",   postedAt:"3d ago",   city:"Mumbai"    },
  { id:"TSK-19232", title:"Machine learning model — fraud detection",category:"ML/AI",   giver:"Raj Patel",    amount:18000, status:"Matching",    postedAt:"30m ago",  nearbyDoers:1, city:"Ahmedabad"  },
  { id:"TSK-19231", title:"Interior design render — 3D office",  category:"Design",      giver:"Ritika Singh", doer:"Aisha Khan",   amount:11000,status:"In Progress",  postedAt:"2d ago",   city:"Delhi NCR" },
]

// ─── Disputes (15 rows) ────────────────────────────────────────────────────

export interface MockDispute {
  id: string; taskId: string; title: string
  giver: string; doer: string; amount: number
  priority: Priority; status: DispStatus
  sla: string; slaOverdue: boolean; assignedTo?: string; filedAt: string
  city: string
}

export const MOCK_DISPUTES: MockDispute[] = [
  { id:"DSP-2026-0847", taskId:"TSK-19248", title:"Payment not released after task completion", giver:"Priya Mehta",   doer:"Vikram Kumar",  amount:22000, priority:"Critical", status:"Unassigned",       sla:"Over due · Was due 2h ago",   slaOverdue:true,  filedAt:"Just now", city:"Mumbai"    },
  { id:"DSP-2026-0846", taskId:"TSK-19242", title:"Work incomplete — partial delivery",         giver:"Priya Mehta",   doer:"Vikram Kumar",  amount:22000, priority:"High",     status:"In Progress",      sla:"3h 24m · Response due",       slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"2h ago", city:"Kolkata"  },
  { id:"DSP-2026-0845", taskId:"TSK-19235", title:"Work incomplete — partial delivery",         giver:"Priya Mehta",   doer:"Vikram Kumar",  amount:22000, priority:"High",     status:"In Progress",      sla:"3h 24m · Response due",       slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"2h ago", city:"Bengaluru"},
  { id:"DSP-2026-0844", taskId:"TSK-19238", title:"Doer abandoned mid-project without notice",  giver:"Karan Patel",   doer:"Rohan Das",     amount:9500,  priority:"High",     status:"Evidence Pending", sla:"1d 2h · SLA due",             slaOverdue:false, assignedTo:"Riya Verma",  filedAt:"5h ago", city:"Hyderabad" },
  { id:"DSP-2026-0843", taskId:"TSK-19251", title:"Deliverable quality far below standard",     giver:"Karan Patel",   doer:"Vikram Kumar",  amount:4500,  priority:"Medium",   status:"In Progress",      sla:"2d 4h · Response due",        slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"12h ago",city:"Delhi NCR" },
  { id:"DSP-2026-0842", taskId:"TSK-19219", title:"Giver refuses to release escrow payment",    giver:"Sanjay Mehta",  doer:"Tanvi Bose",    amount:3800,  priority:"Critical", status:"Escalated",        sla:"Over due · 3h overdue",       slaOverdue:true,  assignedTo:"Riya Verma",  filedAt:"1d ago", city:"Surat"     },
  { id:"DSP-2026-0841", taskId:"TSK-19215", title:"Task scope changed without consent",         giver:"Nisha Chopra",  doer:"Gopal Nair",    amount:2200,  priority:"Low",      status:"Resolved",         sla:"Done ✓",                      slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"2d ago", city:"Mumbai"    },
  { id:"DSP-2026-0840", taskId:"TSK-19210", title:"Plagiarized content submitted as original",  giver:"Gopal Nair",    doer:"Amit Sharma",   amount:1500,  priority:"High",     status:"Unassigned",       sla:"45m · Response due",          slaOverdue:false, filedAt:"3h ago", city:"Kochi"     },
  { id:"DSP-2026-0839", taskId:"TSK-19205", title:"Revision refused after 3 change requests",  giver:"Ritika Singh",  doer:"Meena Krishnan",amount:12000, priority:"Medium",   status:"Evidence Pending", sla:"1d 8h · Evidence needed",     slaOverdue:false, assignedTo:"Riya Verma",  filedAt:"1d ago", city:"Delhi NCR" },
  { id:"DSP-2026-0838", taskId:"TSK-19200", title:"Payment diverted to personal account",       giver:"Deepak Verma",  doer:"Farhan Qureshi",amount:6500,  priority:"Critical", status:"Escalated",        sla:"Over due · 5h overdue",       slaOverdue:true,  assignedTo:"Aarav Sharma", filedAt:"2d ago", city:"Bengaluru" },
  { id:"DSP-2026-0837", taskId:"TSK-19195", title:"Work not delivered by agreed deadline",      giver:"Raj Patel",     doer:"Mohan Joshi",   amount:5200,  priority:"High",     status:"In Progress",      sla:"4h 12m · Response due",       slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"1d ago", city:"Ahmedabad" },
  { id:"DSP-2026-0836", taskId:"TSK-19190", title:"Unauthorized use of client brand assets",   giver:"Aisha Khan",    doer:"Priya Sharma",  amount:3500,  priority:"Medium",   status:"Resolved",         sla:"Done ✓",                      slaOverdue:false, assignedTo:"Riya Verma",  filedAt:"3d ago", city:"Pune"      },
  { id:"DSP-2026-0835", taskId:"TSK-19185", title:"Incorrect invoice raised twice",             giver:"Lakshmi Reddy", doer:"Suresh Pillai", amount:6000,  priority:"Low",      status:"Resolved",         sla:"Done ✓",                      slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"4d ago", city:"Chennai"   },
  { id:"DSP-2026-0834", taskId:"TSK-19180", title:"Login credentials misused after project",   giver:"Anita Desai",   doer:"Rohan Das",     amount:4200,  priority:"Critical", status:"In Progress",      sla:"Over due · 1h overdue",       slaOverdue:true,  assignedTo:"Riya Verma",  filedAt:"3d ago", city:"Delhi NCR" },
  { id:"DSP-2026-0833", taskId:"TSK-19175", title:"Third-party tools billed without approval", giver:"Karthik Iyer",  doer:"Kavya Rao",     amount:8000,  priority:"Medium",   status:"Evidence Pending", sla:"6h · Waiting for evidence",   slaOverdue:false, assignedTo:"Aarav Sharma", filedAt:"2d ago", city:"Bengaluru" },
]

// ─── Payments (20 rows) ────────────────────────────────────────────────────

export interface MockPayment {
  id: string; taskId: string; taskTitle: string; category: string
  giver: string; doer: string; amount: number; doerEarns: number
  status: PayStatus; releaseWindow?: string; createdAt: string
}

export const MOCK_PAYMENTS: MockPayment[] = [
  { id:"PAY-87233", taskId:"TSK-19250", taskTitle:"Mobile UI UX Design",            category:"Design",      giver:"Priya Mehta",   doer:"Rahul Sharma",   amount:22000, doerEarns:19360, status:"In Escrow",  releaseWindow:"3d 22h · Auto-release window",   createdAt:"Just now"  },
  { id:"PAY-87232", taskId:"TSK-19249", taskTitle:"Mobile UI UX Design",            category:"Design",      giver:"Priya Mehta",   doer:"Rahul Sharma",   amount:3250,  doerEarns:2860,  status:"Released",   releaseWindow:"Overdue · Payment not initiated", createdAt:"Just now"  },
  { id:"PAY-87231", taskId:"TSK-19251", taskTitle:"Mobile UI UX Design",            category:"Design",      giver:"Priya Mehta",   doer:"Rahul Sharma",   amount:22000, doerEarns:19360, status:"Disputed",   releaseWindow:"3d 22h · Auto-release window",   createdAt:"Just now"  },
  { id:"PAY-87230", taskId:"TSK-19248", taskTitle:"Brand Identity Package",         category:"Design",      giver:"Sanjay Mehta",  doer:"Karthik Iyer",   amount:8000,  doerEarns:7040,  status:"In Escrow",  releaseWindow:"5d 8h · Auto-release window",    createdAt:"2h ago"    },
  { id:"PAY-87229", taskId:"TSK-19253", taskTitle:"React Native Bug Fixes",         category:"Development", giver:"Arjun Singh",   doer:"Karan Patel",    amount:3200,  doerEarns:2816,  status:"Released",   releaseWindow:"Released 3h ago",                createdAt:"1d ago"    },
  { id:"PAY-87228", taskId:"TSK-19245", taskTitle:"Email Marketing Campaigns Q2",   category:"Marketing",   giver:"Nisha Chopra",  doer:"Tanvi Bose",     amount:3800,  doerEarns:3344,  status:"Released",   releaseWindow:"Released 6h ago",                createdAt:"1d ago"    },
  { id:"PAY-87227", taskId:"TSK-19244", taskTitle:"Figma Design System for SaaS",   category:"Design",      giver:"Gopal Nair",    doer:"Meena Krishnan", amount:12000, doerEarns:10560, status:"In Escrow",  releaseWindow:"7d 1h · Auto-release window",    createdAt:"1d ago"    },
  { id:"PAY-87226", taskId:"TSK-19242", taskTitle:"Android App Testing — 50 Cases", category:"QA Testing",  giver:"Rohan Das",     doer:"Amit Sharma",    amount:4200,  doerEarns:3696,  status:"Disputed",   releaseWindow:"On hold — dispute in progress",  createdAt:"2d ago"    },
  { id:"PAY-87225", taskId:"TSK-19246", taskTitle:"Shopify Store Setup",            category:"Development", giver:"Raj Patel",     doer:"Deepak Verma",   amount:5200,  doerEarns:4576,  status:"Released",   releaseWindow:"Released yesterday",             createdAt:"2d ago"    },
  { id:"PAY-87224", taskId:"TSK-19241", taskTitle:"Photography — Product Catalog",  category:"Photography", giver:"Lakshmi Reddy", doer:"Farhan Qureshi", amount:6500,  doerEarns:5720,  status:"In Escrow",  releaseWindow:"4d 16h · Auto-release window",   createdAt:"1d ago"    },
  { id:"PAY-87223", taskId:"TSK-19238", taskTitle:"AWS Infrastructure Setup",       category:"DevOps",      giver:"Vikram Kumar",  doer:"Arjun Singh",    amount:9500,  doerEarns:8360,  status:"Failed",     releaseWindow:"Failed — refund pending",        createdAt:"3d ago"    },
  { id:"PAY-87222", taskId:"TSK-19237", taskTitle:"Illustration Pack — 20 Icons",  category:"Design",      giver:"Anita Desai",   doer:"Priya Sharma",   amount:3100,  doerEarns:2728,  status:"Released",   releaseWindow:"Released 2d ago",                createdAt:"3d ago"    },
  { id:"PAY-87221", taskId:"TSK-19236", taskTitle:"Bookkeeping — 3 Months",         category:"Finance",     giver:"Pooja Gupta",   doer:"Sanjay Mehta",   amount:4800,  doerEarns:4224,  status:"Released",   releaseWindow:"Released 4d ago",                createdAt:"4d ago"    },
  { id:"PAY-87220", taskId:"TSK-19235", taskTitle:"Video Editing — 10 YouTube",     category:"Video",       giver:"Karthik Iyer",  doer:"Rohan Das",      amount:7200,  doerEarns:6336,  status:"Disputed",   releaseWindow:"On hold — dispute in progress",  createdAt:"2d ago"    },
  { id:"PAY-87219", taskId:"TSK-19234", taskTitle:"SQL Migration MySQL→Postgres",   category:"Development", giver:"Deepak Verma",  doer:"Suresh Pillai",  amount:6000,  doerEarns:5280,  status:"In Escrow",  releaseWindow:"2d 10h · Auto-release window",   createdAt:"1d ago"    },
  { id:"PAY-87218", taskId:"TSK-19233", taskTitle:"Customer Support Scripting",     category:"Writing",     giver:"Nisha Chopra",  doer:"Kavya Rao",      amount:2600,  doerEarns:2288,  status:"Refunded",   releaseWindow:"Refunded 3d ago",                createdAt:"3d ago"    },
  { id:"PAY-87217", taskId:"TSK-19231", taskTitle:"Interior Design Render — 3D",    category:"Design",      giver:"Ritika Singh",  doer:"Aisha Khan",     amount:11000, doerEarns:9680,  status:"In Escrow",  releaseWindow:"6d 3h · Auto-release window",    createdAt:"2d ago"    },
  { id:"PAY-87216", taskId:"TSK-19224", taskTitle:"SEO Keyword Research Report",    category:"Marketing",   giver:"Mohan Joshi",   doer:"Tanvi Bose",     amount:1800,  doerEarns:1584,  status:"Released",   releaseWindow:"Released 5d ago",                createdAt:"5d ago"    },
  { id:"PAY-87215", taskId:"TSK-19220", taskTitle:"Logo Design — Cafe Brand",       category:"Design",      giver:"Sneha Joshi",   doer:"Priya Sharma",   amount:450,   doerEarns:396,   status:"Released",   releaseWindow:"Released 1w ago",                createdAt:"1w ago"    },
  { id:"PAY-87214", taskId:"TSK-19215", taskTitle:"ML Model Fraud Detection",       category:"ML/AI",       giver:"Raj Patel",     doer:"Deepak Verma",   amount:18000, doerEarns:15840, status:"In Escrow",  releaseWindow:"10d 6h · Auto-release window",   createdAt:"3d ago"    },
]

// ─── Support Tickets (20 rows) ─────────────────────────────────────────────

export interface MockTicket {
  id: string; title: string; category: string
  requesterName: string; requesterRole: "Doer" | "Giver"
  assignedTo?: string; status: TktStatus
  sla: string; slaOverdue: boolean; createdAt: string
}

export const MOCK_TICKETS: MockTicket[] = [
  { id:"TKT-2026-1841", title:"Escrow released but payment not received in bank",     category:"Payment",  requesterName:"Vikram Kumar",   requesterRole:"Doer",  assignedTo:undefined,      status:"Open",         sla:"Overdue",   slaOverdue:true,  createdAt:"3h ago"  },
  { id:"TKT-2026-1840", title:"Escrow released but payment not received in bank",     category:"Account",  requesterName:"Vikram Kumar",   requesterRole:"Giver", assignedTo:"Aarav Sharma", status:"Pending Reply", sla:"42m left",  slaOverdue:false, createdAt:"3h ago"  },
  { id:"TKT-2026-1839", title:"Escrow released but payment not received in bank",     category:"Dispute",  requesterName:"Vikram Kumar",   requesterRole:"Doer",  assignedTo:"Aarav Sharma", status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"3h ago"  },
  { id:"TKT-2026-1838", title:"Escrow released but payment not received in bank",     category:"Payment",  requesterName:"Vikram Kumar",   requesterRole:"Doer",  assignedTo:"Aarav Sharma", status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"3h ago"  },
  { id:"TKT-2026-1837", title:"Escrow released but payment not received in bank",     category:"Payment",  requesterName:"Vikram Kumar",   requesterRole:"Doer",  assignedTo:"Aarav Sharma", status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"3h ago"  },
  { id:"TKT-2026-1836", title:"Cannot login to account after password reset",         category:"Account",  requesterName:"Priya Sharma",   requesterRole:"Giver", assignedTo:undefined,      status:"Unassigned",   sla:"1h left",   slaOverdue:false, createdAt:"5h ago"  },
  { id:"TKT-2026-1835", title:"UPI payment declined during task funding",             category:"Payment",  requesterName:"Karthik Iyer",   requesterRole:"Giver", assignedTo:"Riya Verma",   status:"Open",         sla:"2h left",   slaOverdue:false, createdAt:"6h ago"  },
  { id:"TKT-2026-1834", title:"Profile verification stuck on Aadhaar screen",        category:"KYC",      requesterName:"Tanvi Bose",     requesterRole:"Doer",  assignedTo:undefined,      status:"Unassigned",   sla:"Overdue",   slaOverdue:true,  createdAt:"1d ago"  },
  { id:"TKT-2026-1833", title:"Task marked complete but work not fully done",         category:"Dispute",  requesterName:"Sanjay Mehta",   requesterRole:"Giver", assignedTo:"Aarav Sharma", status:"Pending Reply", sla:"3h left",   slaOverdue:false, createdAt:"1d ago"  },
  { id:"TKT-2026-1832", title:"Notification emails not being received",               category:"Technical",requesterName:"Meena Krishnan", requesterRole:"Doer",  assignedTo:"Riya Verma",   status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"1d ago"  },
  { id:"TKT-2026-1831", title:"App crashes when uploading portfolio images",          category:"Technical",requesterName:"Farhan Qureshi", requesterRole:"Doer",  assignedTo:undefined,      status:"Unassigned",   sla:"4h left",   slaOverdue:false, createdAt:"2d ago"  },
  { id:"TKT-2026-1830", title:"Refund not processed after task cancellation",         category:"Payment",  requesterName:"Gopal Nair",     requesterRole:"Giver", assignedTo:"Aarav Sharma", status:"Open",         sla:"Overdue",   slaOverdue:true,  createdAt:"2d ago"  },
  { id:"TKT-2026-1829", title:"Wrong bank account saved — cannot update",             category:"Account",  requesterName:"Deepak Verma",   requesterRole:"Doer",  assignedTo:"Riya Verma",   status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"2d ago"  },
  { id:"TKT-2026-1828", title:"Trust score dropped unexpectedly after completion",    category:"Trust",    requesterName:"Kavya Rao",      requesterRole:"Doer",  assignedTo:"Aarav Sharma", status:"Pending Reply", sla:"6h left",   slaOverdue:false, createdAt:"2d ago"  },
  { id:"TKT-2026-1827", title:"Map is not showing accurate location for task",        category:"Technical",requesterName:"Raj Patel",      requesterRole:"Giver", assignedTo:undefined,      status:"Unassigned",   sla:"2h left",   slaOverdue:false, createdAt:"3d ago"  },
  { id:"TKT-2026-1826", title:"Payout transfer stuck in processing for 48 hours",    category:"Payment",  requesterName:"Lakshmi Reddy",  requesterRole:"Doer",  assignedTo:"Riya Verma",   status:"Open",         sla:"Overdue",   slaOverdue:true,  createdAt:"3d ago"  },
  { id:"TKT-2026-1825", title:"Duplicate task created by system error",               category:"Technical",requesterName:"Anita Desai",    requesterRole:"Giver", assignedTo:"Aarav Sharma", status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"3d ago"  },
  { id:"TKT-2026-1824", title:"Two-factor auth code not arriving via SMS",            category:"Account",  requesterName:"Ritika Singh",   requesterRole:"Giver", assignedTo:undefined,      status:"Unassigned",   sla:"1h left",   slaOverdue:false, createdAt:"4d ago"  },
  { id:"TKT-2026-1823", title:"Proposal acceptance not reflecting in dashboard",      category:"Technical",requesterName:"Nisha Chopra",   requesterRole:"Giver", assignedTo:"Riya Verma",   status:"Resolved",     sla:"Done ✓",    slaOverdue:false, createdAt:"4d ago"  },
  { id:"TKT-2026-1822", title:"Unable to withdraw earnings — bank validation fails",  category:"Payment",  requesterName:"Suresh Pillai",  requesterRole:"Doer",  assignedTo:"Aarav Sharma", status:"Open",         sla:"3h left",   slaOverdue:false, createdAt:"5d ago"  },
]

// ─── Team Members ──────────────────────────────────────────────────────────

export interface MockTeamMember {
  id: string; name: string; email: string; phone: string
  role: TeamRole; isOnline: boolean; permissions: string[]
  lastAction: string
}

export const MOCK_TEAM: MockTeamMember[] = [
  { id:"ADM-001", name:"Aarav Sharma",  email:"aarav@sayzo.in",   phone:"+91 98765 43210", role:"Super Admin",    isOnline:true,  permissions:["Dashboard","Users","Tasks","Disputes","Payments","Support","Notifications","Team","Communications","Configuration"], lastAction:"2 min ago" },
  { id:"ADM-002", name:"Priya Reddy",   email:"priya@sayzo.in",   phone:"+91 98765 43210", role:"Admin",          isOnline:true,  permissions:["Disputes","Payments","Notifications","Support","Config"],  lastAction:"4 min ago" },
  { id:"ADM-003", name:"Neha Kapoor",   email:"neha@sayzo.in",    phone:"+91 98765 43210", role:"Admin",          isOnline:true,  permissions:["Disputes","Payments","Notifications","Support","Config"],  lastAction:"6 min ago" },
  { id:"ADM-004", name:"Karan Mehta",   email:"karan.m@sayzo.in", phone:"+91 98765 43210", role:"Support Agent",  isOnline:true,  permissions:["Support","Users"],  lastAction:"1 min ago" },
  { id:"ADM-005", name:"Riya Verma",    email:"riya@sayzo.in",    phone:"+91 98765 43210", role:"Support Agent",  isOnline:true,  permissions:["Support","Users"],  lastAction:"1 min ago" },
  { id:"ADM-006", name:"Suresh Iyer",   email:"suresh@sayzo.in",  phone:"+91 98765 43210", role:"Viewer",         isOnline:false, permissions:["Dashboard"],        lastAction:"2 hrs ago" },
]

// ─── Activity Feed (30 items) ──────────────────────────────────────────────

export interface ActivityItem {
  id: string; type: ActivityType
  description: string; user: string; amount?: number
  time: string; city?: string; severity?: "normal" | "high" | "critical"
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id:"act-001", type:"task_posted",      description:"Task TG-4582 posted by Arjun K.",               user:"Arjun K.",       amount:1500,  time:"just now", city:"Mumbai",    severity:"normal"   },
  { id:"act-002", type:"dispute_opened",   description:"Dispute CASE-2892 opened by Vikram S.",         user:"Vikram S.",      amount:2400,  time:"2m ago",   city:"Mumbai",    severity:"critical" },
  { id:"act-003", type:"payout",           description:"Payout ₹1,760 to Diya M. · UPI success",        user:"Diya M.",        amount:1760,  time:"4m ago",   city:"Mumbai",    severity:"normal"   },
  { id:"act-004", type:"user_signup",      description:"User signup Rohan G. · Doer · Pune",            user:"Rohan G.",                    time:"5m ago",   city:"Pune",      severity:"normal"   },
  { id:"act-005", type:"trust_signal",     description:"Device cluster detected (3 accounts) · auto-flagged for review", user:"System",  time:"9m ago",   city:"Delhi NCR", severity:"high"     },
  { id:"act-006", type:"kyc_verified",     description:"KYC verified Tanvi P. · Aadhaar OCR 94% confidence · auto-approved", user:"Tanvi P.", time:"11m ago", city:"Kolkata",  severity:"normal"   },
  { id:"act-007", type:"task_posted",      description:"Task TG-4583 posted by Nisha C.",               user:"Nisha C.",       amount:3500,  time:"14m ago",  city:"Chennai",   severity:"normal"   },
  { id:"act-008", type:"payment_released", description:"Payout ₹4,800 released to Karthik I. · task complete", user:"Karthik I.", amount:4800, time:"18m ago", city:"Bengaluru", severity:"normal"  },
  { id:"act-009", type:"dispute_opened",   description:"Dispute CASE-2891 filed by Pooja G. · escrow hold", user:"Pooja G.", amount:6500, time:"22m ago",  city:"Hyderabad", severity:"critical" },
  { id:"act-010", type:"user_signup",      description:"User signup Manish K. · Giver · Mumbai",        user:"Manish K.",                   time:"25m ago",  city:"Mumbai",    severity:"normal"   },
  { id:"act-011", type:"task_completed",   description:"Task TSK-19240 completed · Copywriting Landing Page", user:"Kavya R.", time:"29m ago", city:"Chennai", severity:"normal"                    },
  { id:"act-012", type:"payout",           description:"Payout ₹2,200 to Arjun S. · UPI failed retry",  user:"Arjun S.",       amount:2200,  time:"33m ago",  city:"Pune",      severity:"high"     },
  { id:"act-013", type:"kyc_verified",     description:"KYC verified Deepak V. · manual review passed", user:"Deepak V.",                   time:"37m ago",  city:"Delhi NCR", severity:"normal"   },
  { id:"act-014", type:"trust_signal",     description:"Multiple failed login attempts · IP flagged",   user:"System",                      time:"41m ago",  city:"Jaipur",    severity:"high"     },
  { id:"act-015", type:"task_posted",      description:"Task TG-4584 posted by Raj P. · ML project",   user:"Raj P.",         amount:18000, time:"45m ago",  city:"Ahmedabad", severity:"normal"   },
  { id:"act-016", type:"payment_released", description:"Payout ₹3,344 to Tanvi B. · email campaigns done", user:"Tanvi B.", amount:3344, time:"50m ago", city:"Mumbai",    severity:"normal"   },
  { id:"act-017", type:"dispute_opened",   description:"Dispute CASE-2890 filed · video editing quality", user:"Karthik I.", amount:7200, time:"54m ago", city:"Bengaluru", severity:"high"    },
  { id:"act-018", type:"user_signup",      description:"User signup Aditya K. · Doer · Surat",          user:"Aditya K.",                   time:"1h ago",   city:"Surat",     severity:"normal"   },
  { id:"act-019", type:"task_completed",   description:"Task TSK-19233 completed · Customer Support Scripts", user:"Kavya R.", time:"1h 5m ago", city:"Mumbai", severity:"normal"                 },
  { id:"act-020", type:"payout",           description:"Payout ₹15,840 to Deepak V. · ML model project",user:"Deepak V.",      amount:15840, time:"1h 10m ago",city:"Delhi NCR",severity:"normal"  },
  { id:"act-021", type:"kyc_verified",     description:"KYC verified Gopal N. · Aadhaar verified",      user:"Gopal N.",                    time:"1h 15m ago",city:"Kochi",    severity:"normal"   },
  { id:"act-022", type:"trust_signal",     description:"High-value task dispute pattern detected on USR-0022", user:"System", time:"1h 20m ago",city:"Jaipur",  severity:"critical"              },
  { id:"act-023", type:"task_posted",      description:"Task TG-4585 posted by Sneha J. · Logo Design", user:"Sneha J.",       amount:450,   time:"1h 25m ago",city:"Mumbai",   severity:"normal"   },
  { id:"act-024", type:"payment_released", description:"Payout ₹2,728 to Priya S. · illustration pack", user:"Priya S.",      amount:2728,  time:"1h 30m ago",city:"Hyderabad",severity:"normal"   },
  { id:"act-025", type:"task_completed",   description:"Task TSK-19246 completed · Shopify Store",      user:"Deepak V.",                   time:"1h 35m ago",city:"Ahmedabad",severity:"normal"  },
  { id:"act-026", type:"dispute_opened",   description:"Dispute CASE-2889 filed · project abandonment", user:"Anita D.",      amount:9500,  time:"1h 40m ago",city:"Delhi NCR",severity:"critical" },
  { id:"act-027", type:"user_signup",      description:"User signup Pooja L. · Giver · Bengaluru",      user:"Pooja L.",                    time:"1h 45m ago",city:"Bengaluru",severity:"normal"   },
  { id:"act-028", type:"payout",           description:"Payout ₹5,720 to Farhan Q. · photography task", user:"Farhan Q.",     amount:5720,  time:"1h 50m ago",city:"Chennai",  severity:"normal"   },
  { id:"act-029", type:"kyc_verified",     description:"KYC verified Ritika S. · PAN card verified",    user:"Ritika S.",                   time:"1h 55m ago",city:"Delhi NCR",severity:"normal"   },
  { id:"act-030", type:"task_posted",      description:"Task TG-4586 posted by Mohan J. · HR docs",     user:"Mohan J.",       amount:2200,  time:"2h ago",   city:"Pune",      severity:"normal"   },
]

// ─── Live Support Conversations ────────────────────────────────────────────

export interface SupportConv {
  id: string; user: string; taskRef: string; preview: string
  time: string; unread: number
  messages: { from: "user" | "agent"; text: string; time: string }[]
}

export const MOCK_CONVS: SupportConv[] = [
  {
    id:"conv-001", user:"Sneha R.", taskRef:"#TKT-4821", preview:"Lorem Ipsum Lorem Ipsum", time:"2m ago", unread:2,
    messages:[
      { from:"user",  text:"My payment is stuck. I completed the task 3 days ago but haven't received my money.", time:"10:24 AM" },
      { from:"agent", text:"Hey Sneha! Thanks for reaching out. Can you share your problem related task? Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum", time:"10:26 AM" },
      { from:"user",  text:"Sure! Here's a recent project I designed — a full e-commerce flow from home to checkout.", time:"10:28 AM" },
      { from:"user",  text:"Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum", time:"10:29 AM" },
    ]
  },
  { id:"conv-002", user:"Arjun K.", taskRef:"#TKT-4821", preview:"Lorem Ipsum Lorem Ipsum", time:"1h ago", unread:1,
    messages:[{ from:"user", text:"I need help with my task payment.", time:"9:00 AM" }]
  },
  { id:"conv-003", user:"Priya S.", taskRef:"#TKT-4821", preview:"Lorem Ipsum Lorem Ipsum...", time:"2d ago", unread:0,
    messages:[{ from:"user", text:"Can you check my account status?", time:"Yesterday" }]
  },
  { id:"conv-004", user:"Vikram N.", taskRef:"#TKT-4821", preview:"Lorem Ipsum Lorem Ipsum...", time:"6d ago", unread:0,
    messages:[{ from:"user", text:"My dispute case isn't updating.", time:"6d ago" }]
  },
]

// ─── Sparkline data for dashboard KPI cards ────────────────────────────────

export const GMV_SPARKLINE    = [820,950,880,1020,1150,1080,1280].map((v) => ({ v }))
export const USERS_SPARKLINE  = [210,240,220,260,280,270,320].map((v) => ({ v }))
export const TASKS_SPARKLINE  = [980,1020,970,1100,1080,1150,1247].map((v) => ({ v }))
